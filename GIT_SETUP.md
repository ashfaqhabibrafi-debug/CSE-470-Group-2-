# Git Repository Setup Guide

This guide will help you connect your Disaster Management project to a Git repository (GitHub, GitLab, Bitbucket, etc.).

## Prerequisites

- Git installed on your system
- A GitHub/GitLab/Bitbucket account (or any Git hosting service)

## Step 1: Initialize Git Repository (if not already initialized)

```bash
# Navigate to your project directory
cd "/Users/md.ashfaqhabibrafi/Documents/CSE-470[Project]"

# Initialize git repository
git init
```

## Step 2: Create a .gitignore File

A `.gitignore` file has already been created in the root directory to exclude:
- `node_modules/` folders
- `.env` files (to protect your API keys and secrets)
- `build/` folders
- IDE files
- Other temporary files

**Important:** Never commit `.env` files as they contain sensitive information like API keys and database credentials.

## Step 3: Add Files to Git

```bash
# Add all files (except those in .gitignore)
git add .

# Check what will be committed
git status
```

## Step 4: Create Initial Commit

```bash
# Create your first commit
git commit -m "Initial commit: Disaster Management System"
```

## Step 5: Create a Repository on GitHub (or your Git hosting service)

1. Go to [GitHub](https://github.com) (or your preferred Git hosting service)
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., "disaster-management-system")
5. Choose public or private
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 6: Connect Your Local Repository to Remote

After creating the repository on GitHub, you'll see instructions. Use these commands:

```bash
# Add the remote repository (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# Or if using SSH (if you have SSH keys set up):
# git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# Verify the remote was added
git remote -v
```

## Step 7: Push Your Code

```bash
# Push to the remote repository
git branch -M main
git push -u origin main
```

If you're using an older version of GitHub or a different service, you might need:
```bash
git branch -M master
git push -u origin master
```

## Step 8: Verify

1. Go to your repository on GitHub
2. You should see all your files there
3. Make sure `.env` files are NOT visible (they should be ignored)

## Future Updates

To push future changes:

```bash
# Check status
git status

# Add changed files
git add .

# Commit changes
git commit -m "Description of your changes"

# Push to remote
git push
```

## Important Notes

### Environment Variables

Your `.env` files contain sensitive information:
- Database connection strings
- API keys (Google Maps, etc.)
- JWT secrets

These should **NEVER** be committed to Git. The `.gitignore` file already excludes them, but double-check before committing.

### Team Collaboration

If working in a team:
1. Create a `.env.example` file with placeholder values
2. Commit the `.env.example` file
3. Team members can copy it to `.env` and fill in their own values

Example `.env.example`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_jwt_secret_here
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Common Git Commands

```bash
# Check status
git status

# View changes
git diff

# View commit history
git log

# Create a new branch
git checkout -b feature-name

# Switch branches
git checkout branch-name

# Merge a branch
git merge branch-name

# Pull latest changes from remote
git pull

# Clone a repository (for team members)
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
```

## Troubleshooting

### If you accidentally committed .env files:

```bash
# Remove from Git (but keep the file locally)
git rm --cached backend/.env
git rm --cached frontend/.env

# Commit the removal
git commit -m "Remove .env files from repository"

# Push the changes
git push
```

### If you need to change the remote URL:

```bash
# View current remote
git remote -v

# Change the remote URL
git remote set-url origin NEW_REPOSITORY_URL

# Verify the change
git remote -v
```

### Authentication Issues:

If you encounter authentication errors when pushing:
- For HTTPS: Use a Personal Access Token instead of password
- For SSH: Make sure you have SSH keys set up in your Git hosting service

---

**Congratulations!** Your project is now connected to a Git repository. 🎉

