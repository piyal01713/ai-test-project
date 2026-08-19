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
3. If exactly one issue is found (because it has the 'in-progress' label), immediately read its details carefully and begin implementation without asking. If multiple are found, ask the user which one to implement.
4. If no issues are found, tell the user to make sure they added the `in-progress` label to the ticket on GitHub.
5. Create a new Git branch for the ticket:
   ```bash
   git checkout -b issue-<NUMBER>
   ```
6. Read `product.md` in the project root to fully understand the product specification, tech stack, architecture, and quality requirements.
7. Plan the changes required to fulfill the ticket requirements, dividing them into frontend and backend tasks. Be specific and detailed in the task descriptions — reference exact files, components, API endpoints, and design tokens.

## Agent Delegation

8. Delegate the implementation to your subagents:
   - Use `view_file` to read `.agents/prompts/be_agent.md` and `.agents/prompts/fe_agent.md`.
   - Use the `define_subagent` tool to create a **Backend Subagent** (name: `be_agent`) and a **Frontend Subagent** (name: `fe_agent`). Ensure `enable_write_tools` is true for both.
   - Use the `invoke_subagent` tool to pass the respective tasks to them. In the prompt for each agent, include:
     - The full ticket description
     - The specific tasks they need to implement
     - Explicit references to `product.md` for context
   - Wait for both agents to report back that their work is complete.

## Design Review Hook (Post-Frontend)

9. **After the Frontend Subagent completes**, trigger a design review:
   - Use `view_file` to read `.agents/prompts/design_reviewer_agent.md`.
   - Use the `define_subagent` tool to create a **Design Reviewer Subagent** (name: `design_reviewer_agent`). Ensure `enable_write_tools` is true.
   - Invoke it with a prompt that asks it to review the frontend implementation against the design standards in `product.md` and `fe_agent.md`.
   - **If the Design Reviewer finds issues**: Route the design issues back to the `fe_agent` for correction. After fixes, re-run the design review. Repeat until the Design Reviewer reports **DESIGN APPROVED**.
   - **If the Design Reviewer approves**: Proceed to QA.

## QA Verification

10. Delegate verification to the QA subagent:
    - Use `view_file` to read `.agents/prompts/qa_agent.md`.
    - Use the `define_subagent` tool to create a **QA Subagent** (name: `qa_agent`). Ensure `enable_write_tools` is true.
    - Use the `invoke_subagent` tool to pass the implemented task to it for testing, review, and verification.
    - Wait for it to report back that the tests pass and the task is verified.
    - If the QA subagent finds **backend issues**, route them to the `be_agent`.
    - If the QA subagent finds **frontend/visual issues**, route them to the `fe_agent` (and re-run design review after fixes if visual changes were made).

## Commit & Push

11. Once QA reports **VERIFIED**, commit the changes referencing the issue number:
    ```bash
    git add -A
    git commit -m "Implement <feature> (fixes #<NUMBER>)"
    ```
12. Ask the user if they want to push the branch to GitHub.

## Move Ticket to Done

13. After the commit (and push, if chosen), move the ticket to the "Done" column on the GitHub Project board and update its labels:
    ```bash
    python3 .agents/skills/implement-tickets/scripts/move_to_done.py <NUMBER>
    ```
    This will:
    - Remove the `in-progress` label from the issue
    - Add a `done` label to the issue
    - Move the issue to the **Done** column on the linked GitHub Project board (if one exists)

    *Note: `GITHUB_TOKEN` must be exported with `repo` and `project` scopes.*
