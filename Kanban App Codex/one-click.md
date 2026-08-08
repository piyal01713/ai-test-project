# One-Click Connection with GitHub

To connect this project to a new GitHub repository, follow these steps:

1. **Create a new repository on GitHub** (do not initialize with a README, .gitignore, or license).
2. **Copy the repository URL** (e.g., `https://github.com/yourusername/your-repo.git`).
3. **Run the following commands** in your terminal at the root of this project (`/home/peea/Documents/Kanban App Codex`):

```bash
# Initialize a new Git repository
git init

# Add all files to the staging area
git add .

# Commit the changes
git commit -m "Initial commit: MVP of Kanban App"

# Rename the default branch to main
git branch -M main

# Add the remote repository (Replace <YOUR_GITHUB_REPO_URL> with your actual URL)
git remote add origin <YOUR_GITHUB_REPO_URL>

# Push the code to GitHub
git push -u origin main
```

**Note:** Ensure you have the [GitHub CLI (`gh`)](https://cli.github.com/) or Git authenticated on your machine before pushing. If you want to use `gh` to do it all from the terminal without leaving, run:

```bash
git init
git add .
git commit -m "Initial commit: MVP of Kanban App"
gh repo create kanban-app-codex --public --source=. --remote=origin --push
```
