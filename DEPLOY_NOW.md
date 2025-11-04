# Deploy to GitHub Pages NOW - Quick Commands

Copy and paste these commands to deploy in **5 minutes**!

## Step 1: Open Terminal

```bash
# Navigate to your project folder
cd /Users/kuangshiai/Documents/ND-VIS/SciVisAgentBench-data_collection_page
```

## Step 2: Initialize Git

```bash
# Initialize repository
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: SciVisAgentBench data collection website"
```

**✅ Expected:** See message like "XX files changed, XXXX insertions(+)"

## Step 3: Create GitHub Repository

**Go to:** https://github.com/new

**Settings:**
- **Name:** `SciVisAgentBench-data-collection`
- **Public:** ✅ YES (required for free Pages)
- **Initialize:** ❌ NO (leave all checkboxes unchecked)

**Click:** "Create repository"

## Step 4: Push to GitHub

**Replace `YOUR_USERNAME` with your actual GitHub username:**

```bash
# Add remote (CHANGE YOUR_USERNAME!)
git remote add origin https://github.com/YOUR_USERNAME/SciVisAgentBench-data-collection.git

# Set main branch
git branch -M main

# Push code
git push -u origin main
```

**📝 Enter GitHub username and password when prompted**

**✅ Expected:** See "To https://github.com/YOUR_USERNAME/..." message

## Step 5: Enable GitHub Pages

1. **Go to:** `https://github.com/YOUR_USERNAME/SciVisAgentBench-data-collection`
2. **Click:** "Settings" tab
3. **Click:** "Pages" in left sidebar
4. **Source:** Select "main" branch, "/ (root)" folder
5. **Click:** "Save"

**⏳ Wait 2 minutes...**

## Step 6: Access Your Site!

**Your site will be live at:**
```
https://YOUR_USERNAME.github.io/SciVisAgentBench-data-collection/
```

**🎉 DONE! Your site is live!**

---

## Quick Test

Open your site and:
1. ✅ Dashboard loads
2. ✅ Click "Submit Dataset" - form appears
3. ✅ Click "About" - about page appears
4. ✅ Fill out form and submit - see success message
5. ✅ Go back to Dashboard - see your test submission

**Note:** Right now it uses localStorage (browser only). Add Firebase later for cloud storage!

---

## Update Site Later

When you make changes:

```bash
git add .
git commit -m "Your change description"
git push
```

Wait ~2 minutes for automatic deployment.

---

## Need Help?

- **Detailed guide:** See `GITHUB_DEPLOYMENT.md`
- **Git not installed:** Download from https://git-scm.com
- **GitHub account:** Sign up at https://github.com
- **Permission errors:** Use HTTPS URL (not SSH)

---

## What's Next?

After deployment works:

1. ✅ Test your live site
2. ✅ Share the link with collaborators
3. ✅ Collect feedback
4. 🔥 Add Firebase (follow `FIREBASE_QUICKSTART.md`)

**Current status:** Demo mode (localStorage only)
**With Firebase:** Full cloud storage and file uploads
