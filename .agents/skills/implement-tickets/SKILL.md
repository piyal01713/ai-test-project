---
name: implement-tickets
description: >-
  Use this skill to pull open tickets from the connected GitHub repository and implement them automatically.
---

# Implement Tickets Skill

Use this skill when the user asks to implement tickets or pull issues from GitHub.

## Steps

1. Check if the project is connected to a GitHub repository by checking `git remote -v`.
   - If not connected, instruct the user to create a GitHub repo and add the origin remote.
2. Run the `fetch_issues.py` script to get the list of open tickets:
   ```bash
   python3 .agents/skills/implement-tickets/scripts/fetch_issues.py
   ```
   *Note: If the repository is private, you will need to export `GITHUB_TOKEN` before running the script.*
3. If issues are found, present them to the user and ask which one they would like to implement.
4. Once the user selects a ticket, read its details carefully.
5. Create a new Git branch for the ticket:
   ```bash
   git checkout -b issue-<NUMBER>
   ```
6. Plan the changes required to fulfill the ticket requirements.
7. Implement the necessary code changes.
8. Commit the changes, referencing the issue number (e.g., `git commit -m "Fix bug XYZ (fixes #<NUMBER>)"`).
9. Ask the user if they want to push the branch to GitHub.
