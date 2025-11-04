# GitHub Pages Deployment Guide

Deploy your website to GitHub Pages in **10 minutes**! This will make your site live at `https://YOUR_USERNAME.github.io/REPO_NAME/`

## Prerequisites

- [ ] GitHub account (sign up at https://github.com if you don't have one)
- [ ] Git installed on your computer
- [ ] Your project files in the `SciVisAgentBench-data_collection_page` folder

## Step 1: Initialize Git Repository (2 minutes)

Open terminal/command prompt and navigate to your project folder:

```bash
cd /Users/kuangshiai/Documents/ND-VIS/SciVisAgentBench-data_collection_page
```

Initialize git and make first commit:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: SciVisAgentBench data collection website"
```

**Expected output:**
```
Initialized empty Git repository in .../SciVisAgentBench-data_collection_page/.git/
[main (root-commit) abc1234] Initial commit: SciVisAgentBench data collection website
 XX files changed, XXXX insertions(+)
```

## Step 2: Create GitHub Repository (3 minutes)

1. **Go to GitHub**: https://github.com
2. **Sign in** to your account
3. **Click the "+" icon** in top-right corner → **"New repository"**

4. **Configure repository:**
   - **Repository name**: `SciVisAgentBench-data-collection` (or your preferred name)
   - **Description**: "Data collection website for SciVisAgentBench"
   - **Visibility**:
     - ✅ **Public** (recommended - required for free GitHub Pages)
     - ⚠️ Private (requires GitHub Pro for Pages)
   - **Do NOT check** "Add a README file"
   - **Do NOT check** "Add .gitignore"
   - **Do NOT check** "Choose a license"

5. **Click "Create repository"**

## Step 3: Connect Local Repo to GitHub (2 minutes)

After creating the repo, GitHub will show you commands. Copy the URL (should look like: `https://github.com/YOUR_USERNAME/SciVisAgentBench-data-collection.git`)

In your terminal, run:

```bash
# Add GitHub as remote (replace YOUR_USERNAME with your actual username)
git remote add origin https://github.com/YOUR_USERNAME/SciVisAgentBench-data-collection.git

# Rename branch to main (if not already)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Enter your GitHub credentials when prompted.**

**Expected output:**
```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
...
To https://github.com/YOUR_USERNAME/SciVisAgentBench-data-collection.git
 * [new branch]      main -> main
```

## Step 4: Enable GitHub Pages (3 minutes)

1. **Go to your repository** on GitHub:
   `https://github.com/YOUR_USERNAME/SciVisAgentBench-data-collection`

2. **Click "Settings"** tab (at the top of the repo)

3. **In the left sidebar**, scroll down and click **"Pages"**

4. **Configure GitHub Pages:**
   - **Source**: Select **"Deploy from a branch"**
   - **Branch**: Select **"main"** and **"/ (root)"**
   - Click **"Save"**

5. **Wait for deployment** (~1-2 minutes)
   - You'll see: "Your site is live at https://YOUR_USERNAME.github.io/SciVisAgentBench-data-collection/"
   - If it says "Your site is ready to be published", wait and refresh the page

## Step 5: Test Your Live Site (2 minutes)

1. **Open the URL**: `https://YOUR_USERNAME.github.io/SciVisAgentBench-data-collection/`

2. **Test the website:**
   - ✅ Dashboard loads
   - ✅ Navigate to Submit Dataset
   - ✅ Navigate to About
   - ✅ Open browser console (F12)
   - ✅ Should see: "Loaded from localStorage (demo mode)"

3. **Test form (demo mode):**
   - Fill out the form
   - Select some files
   - Click Submit
   - Should see success message
   - Navigate to Dashboard - should see your test submission

**🎉 Congratulations! Your site is now live!**

## What Works Now (Without Firebase)

✅ **Static website hosting** - Fast, free, and reliable
✅ **All pages work** - Dashboard, Submit, About
✅ **Form submission** - Saves to browser localStorage (demo mode)
✅ **Dashboard updates** - Shows submissions from localStorage
✅ **File selection** - Can select files (but they're not uploaded to cloud)

## What Doesn't Work Yet (Without Firebase)

❌ **Persistent storage** - Data only in user's browser
❌ **File uploads** - Files selected but not stored anywhere
❌ **Cross-device access** - Can't see submissions from other computers
❌ **Shared dashboard** - Each user sees only their own submissions

## Next Steps

### Option A: Keep as Demo (No Firebase)
Good for:
- Testing the interface
- Getting feedback on UX
- Demonstrating the concept

Just add a notice to users that it's demo mode.

### Option B: Add Firebase (Recommended)
When you're ready:
1. Follow `FIREBASE_QUICKSTART.md`
2. Update `firebase-config.js` with your credentials
3. Commit and push changes:
   ```bash
   git add .
   git commit -m "Add Firebase integration"
   git push
   ```
4. GitHub Pages will auto-update in ~2 minutes

## Updating Your Site

Whenever you make changes:

```bash
# Make your changes to the files
# Then commit and push:

git add .
git commit -m "Describe your changes here"
git push

# Wait ~2 minutes for GitHub Pages to rebuild
```

## Troubleshooting

### Issue: "git: command not found"
**Solution:** Install Git:
- **Mac**: `brew install git` or download from https://git-scm.com
- **Windows**: Download from https://git-scm.com
- **Linux**: `sudo apt install git` or `sudo yum install git`

### Issue: "Permission denied (publickey)"
**Solution:** Use HTTPS instead of SSH:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/SciVisAgentBench-data-collection.git
```

### Issue: "Repository not found"
**Solution:** Check the URL is correct:
```bash
git remote -v
# Should show: origin  https://github.com/YOUR_USERNAME/SciVisAgentBench-data-collection.git
```

### Issue: GitHub Pages shows 404
**Solutions:**
1. Wait 2-3 minutes after enabling Pages
2. Check Settings → Pages shows "Your site is live"
3. Verify branch is set to "main" and folder is "/ (root)"
4. Check `index.html` exists in the root of your repo

### Issue: Site loads but looks broken
**Solutions:**
1. Check browser console (F12) for errors
2. Verify all files were committed and pushed:
   ```bash
   git status
   # Should say: "nothing to commit, working tree clean"
   ```
3. Make sure `styles.css` and `script.js` are in the same folder as `index.html`

### Issue: Form doesn't work
**Solution:** This is expected! Without Firebase:
- Form saves to localStorage (browser only)
- Files are selected but not uploaded
- Add Firebase to enable full functionality

## Custom Domain (Optional)

Want to use your own domain (e.g., `data.scivisagent.org`)?

1. **Buy a domain** (from Namecheap, Google Domains, etc.)
2. **In GitHub repo Settings → Pages:**
   - Enter your custom domain
   - Check "Enforce HTTPS"
3. **In your domain registrar:**
   - Add CNAME record pointing to: `YOUR_USERNAME.github.io`
4. **Wait for DNS propagation** (~1-24 hours)

## GitHub Pages Limits

- **Storage**: 1 GB repository size
- **Bandwidth**: 100 GB/month (soft limit)
- **Build time**: 10 minutes max
- **File size**: 100 MB per file
- **Visitors**: Unlimited

These limits are very generous for a data collection site!

## Verification Checklist

Before moving to Firebase, verify:

- [ ] Site is accessible at `https://YOUR_USERNAME.github.io/REPO_NAME/`
- [ ] All three pages work (Dashboard, Submit, About)
- [ ] Form can be filled out
- [ ] Test submission shows success message
- [ ] Dashboard shows test submissions (in your browser)
- [ ] Site looks correct on mobile (check with browser dev tools)
- [ ] No console errors (press F12 to check)

## Share Your Site

Your site is now public! Share it with:
- **Direct link**: `https://YOUR_USERNAME.github.io/SciVisAgentBench-data-collection/`
- **Add to README**: Create a badge in your repo README
- **Social media**: Tweet about it!
- **Documentation**: Link from your main SciVisAgentBench repo

## Cost

**GitHub Pages is 100% FREE for public repositories!**

No credit card required, no hidden fees.

---

## Summary

✅ **You now have a live website at**: `https://YOUR_USERNAME.github.io/REPO_NAME/`

✅ **It works in demo mode** (localStorage only)

✅ **Ready for Firebase integration** when you're ready

**Next:** When you want to add cloud storage, follow `FIREBASE_QUICKSTART.md`

---

**Questions?** Open an issue on GitHub or check GitHub Pages docs: https://docs.github.com/en/pages
