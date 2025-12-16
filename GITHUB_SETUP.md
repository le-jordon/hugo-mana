# GitHub Repository Setup Instructions

## Step 1: Create Private Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `hugo-mana-theme`
3. Set visibility to **Private**
4. **Do NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 2: Initialize Git in Theme Directory

```bash
cd themes/mana
git init
git add .
git commit -m "Initial commit: Hugo Mana theme"
```

## Step 3: Add Remote and Push

```bash
git remote add origin git@github.com:Livour/hugo-mana-theme.git
git branch -M main
git push -u origin main
```

## Step 4: Add as Submodule (from project root)

After pushing to GitHub, go back to your project root and add it as a submodule:

```bash
cd ../..
git submodule add git@github.com:Livour/hugo-mana-theme.git themes/mana
```

## Step 5: Commit Submodule Addition

```bash
git add .gitmodules themes/mana
git commit -m "Add mana theme as submodule"
```

## Notes

- Make sure you have SSH keys set up with GitHub for the `git@github.com` URLs
- If you prefer HTTPS, use `https://github.com/Livour/hugo-mana-theme.git` instead
- The theme is now set up as a submodule and can be updated independently

