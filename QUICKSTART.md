# Quick Start Guide

Get the SciVisAgentBench data collection website running in 5 minutes!

## Local Testing (Immediate)

### Option 1: Python (Recommended)
```bash
cd SciVisAgentBench-data_collection_page
python3 -m http.server 8000
```
Open browser to: `http://localhost:8000`

### Option 2: PHP
```bash
php -S localhost:8000
```

### Option 3: Node.js
```bash
npx http-server -p 8000
```

## Deploy to GitHub Pages (5 minutes)

### Step 1: Create Repository
```bash
cd SciVisAgentBench-data_collection_page
git init
git add .
git commit -m "Initial commit: Data collection website"
```

### Step 2: Push to GitHub
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/scivisagentbench-data.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **main** branch
4. Click **Save**
5. Wait 1-2 minutes

Your site will be live at:
`https://YOUR_USERNAME.github.io/scivisagentbench-data/`

## Test the Website

### Submit a Test Dataset
1. Navigate to "Submit Dataset" section
2. Fill in contributor information
3. Complete dataset metadata
4. Submit the form
5. Check the Dashboard to see your submission appear

### View Statistics
- Dashboard shows real-time statistics
- Contributors table updates automatically
- Category breakdowns refresh after each submission

## Export Data

Open browser console (F12) and run:
```javascript
exportSubmissions()
```
This downloads all submissions as JSON.

## Next Steps

### For Production Use

1. **Add Backend API**:
   - Replace localStorage with database
   - Implement file upload handling
   - Add authentication

2. **Connect to Benchmark**:
   - Export submissions to YAML format
   - Integrate with evaluation pipeline
   - Set up automated testing

3. **Customize**:
   - Update colors in `styles.css`
   - Add institution logos
   - Modify form fields as needed

## Common Issues

### Issue: Website doesn't load
**Solution**: Check browser console for errors. Ensure all files are in the same directory.

### Issue: Form submission doesn't work
**Solution**: Check that JavaScript is enabled. Try a different browser.

### Issue: GitHub Pages shows 404
**Solution**: Wait a few minutes after enabling Pages. Check that `index.html` is in the root directory.

## Support

- **Documentation**: See `README.md` for detailed information
- **Contributing**: See `CONTRIBUTING.md` for dataset submission guidelines
- **Issues**: Report bugs on [GitHub Issues](https://github.com/KuangshiAi/SciVisAgentBench/issues)

## File Structure

```
SciVisAgentBench-data_collection_page/
├── index.html          # Main website file
├── styles.css          # Styling
├── script.js           # Functionality
├── README.md           # Detailed documentation
├── CONTRIBUTING.md     # Contribution guidelines
├── QUICKSTART.md       # This file
├── .gitignore          # Git ignore rules
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions deployment
```

## Features at a Glance

✅ **Dashboard**: Real-time statistics and contributor recognition
✅ **Submission Form**: Comprehensive dataset metadata collection
✅ **Responsive Design**: Works on desktop, tablet, and mobile
✅ **No Dependencies**: Pure HTML/CSS/JavaScript
✅ **Easy Deployment**: GitHub Pages ready
✅ **Data Export**: JSON export functionality
✅ **Modern UI**: Clean, professional design

## What's Next?

After deploying, you can:
1. Share the link with potential contributors
2. Collect datasets from the community
3. Export submissions and integrate with SciVisAgentBench
4. Customize the website for your institution
5. Add backend integration for production use

Happy collecting! 🎉
