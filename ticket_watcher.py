import time
import json
import subprocess
import urllib.request
import re
import os

PROCESSED_FILE = ".processed_issues.json"

def get_repo_url():
    try:
        url = subprocess.check_output(['git', 'config', '--get', 'remote.origin.url'], text=True).strip()
        return url
    except subprocess.CalledProcessError:
        return None

def parse_owner_repo(url):
    match = re.search(r'github\.com[:/](.+?)/(.+?)(\.git)?$', url)
    if match:
        return match.group(1), match.group(2)
    return None, None

def load_processed():
    if os.path.exists(PROCESSED_FILE):
        with open(PROCESSED_FILE, "r") as f:
            return json.load(f)
    return []

def save_processed(processed):
    with open(PROCESSED_FILE, "w") as f:
        json.dump(processed, f)

def fetch_issues(owner, repo):
    api_url = f"https://api.github.com/repos/{owner}/{repo}/issues?labels=in-progress&state=open"
    headers = {'User-Agent': 'Mozilla/5.0', 'Accept': 'application/vnd.github.v3+json'}
    token = os.environ.get('GITHUB_TOKEN')
    if token:
        headers['Authorization'] = f'token {token}'
        
    req = urllib.request.Request(api_url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            return data
    except Exception as e:
        print(f"Error fetching issues: {e}")
        return []

def load_agent_instructions(agent_type):
    filepath = f".agents/prompts/{agent_type}_agent.md"
    if os.path.exists(filepath):
        with open(filepath, "r") as f:
            return f.read()
    return "You are a Senior Full-Stack Engineer. Follow industry standard practices for clean, maintainable code."

def main():
    url = get_repo_url()
    if not url:
        print("Error: No remote origin URL found in git config. Please set up your repo first.")
        return
    owner, repo = parse_owner_repo(url)
    if not owner or not repo:
        print(f"Error: Could not parse owner and repo from URL: {url}")
        return

    print(f"Starting ticket watcher for {owner}/{repo}. Polling every 30 seconds...")
    print("Waiting for tickets labeled 'in-progress'...")

    while True:
        issues = fetch_issues(owner, repo)
        processed = load_processed()
        
        for issue in issues:
            if 'pull_request' in issue:
                continue
                
            issue_num = issue['number']
            if issue_num not in processed:
                print(f"\n--- New 'in-progress' ticket detected: #{issue_num} - {issue['title']} ---")
                
                # Check labels to assign the right agent
                labels = [lbl['name'].lower() for lbl in issue.get('labels', [])]
                
                if 'frontend' in labels or 'fe' in labels:
                    print("=> Detected Frontend label. Waking up the FE Agent...")
                    instructions = load_agent_instructions("fe")
                elif 'backend' in labels or 'be' in labels:
                    print("=> Detected Backend label. Waking up the BE Agent...")
                    instructions = load_agent_instructions("be")
                else:
                    print("=> No FE/BE label detected. Waking up Generic Agent...")
                    instructions = "You are a Senior Software Engineer."
                
                prompt = (
                    f"{instructions}\n\n"
                    f"--- TASK ---\n"
                    f"Implement the requirements described in GitHub Issue #{issue_num}:\n"
                    f"Title: {issue['title']}\n"
                    f"Description: {issue['body']}"
                )
                
                try:
                    subprocess.run(["agy", "--goal", prompt])
                except Exception as e:
                    print(f"Failed to launch agent: {e}")
                
                processed.append(issue_num)
                save_processed(processed)
                print(f"\n--- Agent finished ticket #{issue_num}. Resuming polling... ---")

        time.sleep(30)

if __name__ == "__main__":
    main()
