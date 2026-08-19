"""
Move a GitHub issue to the "Done" column in the repository's GitHub Project (v2).

Usage:
    python3 move_to_done.py <issue_number>

Requirements:
    - GITHUB_TOKEN environment variable must be set with appropriate permissions
      (repo, project scopes).
    - The repository must have a GitHub Projects (v2) board with a "Status" field
      that includes a "Done" option.
"""

import sys
import json
import subprocess
import urllib.request
import re
import os


def get_repo_owner_and_name():
    """Extract owner/repo from the git remote origin URL."""
    try:
        url = subprocess.check_output(
            ['git', 'config', '--get', 'remote.origin.url'], text=True
        ).strip()
    except subprocess.CalledProcessError:
        print("Error: No remote origin URL found in git config.")
        sys.exit(1)

    match = re.search(r'github\.com[:/](.+?)/(.+?)(\.git)?$', url)
    if match:
        return match.group(1), match.group(2)
    print(f"Error: Could not parse owner and repo from URL: {url}")
    sys.exit(1)


def graphql(query, variables, token):
    """Execute a GitHub GraphQL API request."""
    payload = json.dumps({"query": query, "variables": variables}).encode()
    req = urllib.request.Request(
        "https://api.github.com/graphql",
        data=payload,
        headers={
            "Authorization": f"bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            if "errors" in data:
                print(f"GraphQL errors: {json.dumps(data['errors'], indent=2)}")
                return None
            return data.get("data")
    except urllib.error.HTTPError as e:
        body = e.read().decode() if e.fp else ""
        print(f"HTTP Error {e.code}: {body}")
        return None


def rest_api(method, path, token, body=None):
    """Execute a GitHub REST API request."""
    url = f"https://api.github.com{path}"
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Mozilla/5.0",
            "Content-Type": "application/json",
        },
        method=method,
    )
    try:
        with urllib.request.urlopen(req) as resp:
            if resp.status == 204:
                return {}
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body_text = e.read().decode() if e.fp else ""
        print(f"REST API Error {e.code} on {method} {path}: {body_text}")
        return None


def find_project_item(owner, repo, issue_number, token):
    """
    Find the project item ID and project details for a given issue.
    Returns (project_id, item_id, status_field_id, done_option_id) or raises.
    """
    # Step 1: Get the issue's node ID
    query = """
    query($owner: String!, $repo: String!, $number: Int!) {
      repository(owner: $owner, name: $repo) {
        issue(number: $number) {
          id
          projectItems(first: 10) {
            nodes {
              id
              project {
                id
                title
                field(name: "Status") {
                  ... on ProjectV2SingleSelectField {
                    id
                    options {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    """
    data = graphql(query, {"owner": owner, "repo": repo, "number": issue_number}, token)
    if not data:
        return None

    issue = data.get("repository", {}).get("issue")
    if not issue:
        print(f"Error: Issue #{issue_number} not found.")
        return None

    items = issue.get("projectItems", {}).get("nodes", [])
    if not items:
        print(f"Issue #{issue_number} is not linked to any GitHub Project board.")
        print("Skipping project board update — labels will still be updated.")
        return None

    # Use the first project item found
    item = items[0]
    project = item["project"]
    status_field = project.get("field")

    if not status_field:
        print(f"Warning: No 'Status' field found in project '{project['title']}'.")
        return None

    # Find the "Done" option
    done_option = None
    for option in status_field.get("options", []):
        if option["name"].lower() == "done":
            done_option = option
            break

    if not done_option:
        available = [o["name"] for o in status_field.get("options", [])]
        print(f"Warning: No 'Done' option in Status field. Available: {available}")
        return None

    return project["id"], item["id"], status_field["id"], done_option["id"]


def move_item_to_done(project_id, item_id, field_id, option_id, token):
    """Update the project item's Status field to 'Done'."""
    mutation = """
    mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
      updateProjectV2ItemFieldValue(
        input: {
          projectId: $projectId
          itemId: $itemId
          fieldId: $fieldId
          value: { singleSelectOptionId: $optionId }
        }
      ) {
        projectV2Item {
          id
        }
      }
    }
    """
    result = graphql(
        mutation,
        {
            "projectId": project_id,
            "itemId": item_id,
            "fieldId": field_id,
            "optionId": option_id,
        },
        token,
    )
    return result is not None


def update_labels(owner, repo, issue_number, token):
    """Remove 'in-progress' label and add 'done' label."""
    path = f"/repos/{owner}/{repo}/issues/{issue_number}/labels"

    # Remove 'in-progress'
    result = rest_api("DELETE", f"{path}/in-progress", token)
    if result is not None:
        print("  ✓ Removed 'in-progress' label")
    else:
        print("  ⚠ Could not remove 'in-progress' label (may not exist)")

    # Add 'done'
    result = rest_api("POST", path, token, {"labels": ["done"]})
    if result is not None:
        print("  ✓ Added 'done' label")
    else:
        print("  ⚠ Could not add 'done' label")


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 move_to_done.py <issue_number>")
        sys.exit(1)

    issue_number = int(sys.argv[1])
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        print("Error: GITHUB_TOKEN environment variable is required.")
        print("Export it with: export GITHUB_TOKEN=<your-token>")
        sys.exit(1)

    owner, repo = get_repo_owner_and_name()
    print(f"Moving issue #{issue_number} to Done in {owner}/{repo}...\n")

    # Update labels (works without a project board)
    print("Updating labels:")
    update_labels(owner, repo, issue_number, token)

    # Move on the project board
    print("\nUpdating project board:")
    result = find_project_item(owner, repo, issue_number, token)
    if result:
        project_id, item_id, field_id, option_id = result
        if move_item_to_done(project_id, item_id, field_id, option_id, token):
            print("  ✓ Moved to 'Done' column on project board")
        else:
            print("  ✗ Failed to move to 'Done' column")
    else:
        print("  ⚠ Skipped project board update")

    print(f"\n✅ Issue #{issue_number} marked as Done.")


if __name__ == "__main__":
    main()
