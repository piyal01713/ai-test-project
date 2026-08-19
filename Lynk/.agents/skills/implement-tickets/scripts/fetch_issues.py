import sys
import json
import subprocess
import urllib.request
import re
import os

def get_repo_url():
    try:
        url = subprocess.check_output(['git', 'config', '--get', 'remote.origin.url'], text=True).strip()
        return url
    except subprocess.CalledProcessError:
        return None

def parse_owner_repo(url):
    # Matches https://github.com/owner/repo.git or git@github.com:owner/repo.git
    match = re.search(r'github\.com[:/](.+?)/(.+?)(\.git)?$', url)
    if match:
        return match.group(1), match.group(2)
    return None, None

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
    except urllib.error.HTTPError as e:
        if e.code == 404:
            print(f"Error: Repository not found (or it's private and no GITHUB_TOKEN was provided).")
        else:
            print(f"HTTP Error fetching issues: {e}")
        return None
    except Exception as e:
        print(f"Error fetching issues: {e}")
        return None

def main():
    if len(sys.argv) > 2:
        owner, repo = sys.argv[1], sys.argv[2]
    else:
        url = get_repo_url()
        if not url:
            print("Error: No remote origin URL found in git config. Please provide owner and repo as arguments, or run `git remote add origin <URL>`.")
            sys.exit(1)
        owner, repo = parse_owner_repo(url)
        if not owner or not repo:
            print(f"Error: Could not parse owner and repo from URL: {url}")
            sys.exit(1)
            
    print(f"Fetching open issues for {owner}/{repo}...")
    issues = fetch_issues(owner, repo)
    if issues is None:
        sys.exit(1)
        
    issue_count = sum(1 for i in issues if 'pull_request' not in i)
    print(f"Found {issue_count} open tickets/issues:\n")
    for issue in issues:
        if 'pull_request' not in issue:
            print(f"[{issue['number']}] {issue['title']}")
            print(f"    URL: {issue['html_url']}")
            body_preview = (issue['body'] or '').strip().split('\n')[0][:100]
            if len((issue['body'] or '').strip()) > 100:
                body_preview += "..."
            print(f"    Details: {body_preview}\n")

if __name__ == "__main__":
    main()
