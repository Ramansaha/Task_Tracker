# CI/CD Setup Instructions

## Step 1: Install Dependencies

Run these commands in your terminal:

```bash
# Navigate to project root
cd /Users/ramankumar/Desktop/github/Task_Tracker

# Install root dependencies (husky, lint-staged)
npm install

# Initialize husky (sets up pre-commit hooks)
npx husky install

# Install backend ESLint dependency
cd backend
npm install
cd ..
```

## Step 2: Test Pre-commit Hook

```bash
# Make a test commit to verify pre-commit hook works
git add .
git commit -m "test: verify pre-commit hook setup"
```

If there are lint errors, the commit will be blocked. Fix them and try again.

## Step 3: Push Changes to GitHub

```bash
# Push all the CI/CD setup files
git add .
git commit -m "feat: add CI/CD pipeline and pre-commit hooks"
git push origin dev
```

## Step 4: Set Up GitHub Branch Protection Rules

Go to your GitHub repository and follow these steps:

### For `dev` Branch:

1. Go to: **Settings** → **Branches** → Click **"Add rule"**
2. **Branch name pattern**: `dev`
3. Enable these settings:
   - ✅ **Require a pull request before merging**
     - ❌ **Do NOT check "Require approvals"** (allows you to merge your own PRs)
   - ✅ **Require status checks to pass before merging**
     - ✅ Require branches to be up to date before merging
     - ✅ Status checks: **CI Pipeline** (will appear after first workflow run)
   - ✅ **Do not allow force pushes**
   - ✅ **Do not allow deletions**
4. Click **"Create"**

### For `staging` Branch:

1. Click **"Add rule"** again
2. **Branch name pattern**: `staging`
3. Enable these settings:
   - ✅ **Require a pull request before merging**
     - ❌ **Do NOT check "Require approvals"** (allows you to merge your own PRs)
   - ✅ **Require status checks to pass before merging**
     - ✅ Require branches to be up to date before merging
     - ✅ Status checks: **CI Pipeline**
   - ✅ **Restrict pushes that create files**
     - Select: **Only allow merges from `dev` branch**
   - ✅ **Do not allow force pushes**
   - ✅ **Do not allow deletions**
4. Click **"Create"**

### For `main` Branch:

1. Click **"Add rule"** again
2. **Branch name pattern**: `main`
3. Enable these settings:
   - ✅ **Require a pull request before merging**
     - ❌ **Do NOT check "Require approvals"** (allows you to merge your own PRs)
   - ✅ **Require status checks to pass before merging**
     - ✅ Require branches to be up to date before merging
     - ✅ Status checks: **CI Pipeline**
   - ✅ **Restrict pushes that create files**
     - Select: **Only allow merges from `staging` branch**
   - ✅ **Do not allow force pushes**
   - ✅ **Do not allow deletions**
4. Click **"Create"**

> **Note for Solo Developers**: Approvals are not required, allowing you to merge your own PRs immediately after CI passes. You can enable approvals later when you add team members.

## Step 5: Test the Workflow

### Test Pre-commit Hook:
1. Create a test branch: `git checkout -b test-pre-commit`
2. Make a small change (add a comment)
3. Try to commit: `git commit -m "test"`
4. Pre-commit hook should run and lint your code

### Test CI Pipeline:
1. Push your test branch: `git push origin test-pre-commit`
2. Create a PR from `test-pre-commit` → `dev`
3. GitHub Actions will automatically run the CI pipeline
4. Check the "Checks" tab in the PR to see CI status

## Workflow Summary

```
Feature Branch → PR to dev → Review → Merge to dev → Auto-deploy dev
                                                          ↓
                                                    PR to staging
                                                          ↓
                                                    Review → Merge to staging → Auto-deploy staging
                                                          ↓
                                                    PR to main
                                                          ↓
                                                    Review → Merge to main → Auto-deploy production
```

## Important Notes

- **Pre-commit hooks** run locally and block commits with lint errors
- **CI Pipeline** runs on GitHub for every PR and push
- **Branch protection** ensures code quality and prevents direct pushes
- **Status checks** must pass before merging PRs
- **Approvals** are NOT required (solo developer setup - you can merge your own PRs)
- **Workflow enforcement**: Code must flow through dev → staging → main

