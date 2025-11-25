# SciVisAgentBench Data Collection Website

A comprehensive web platform for collecting datasets for the SciVisAgentBench - an evaluation framework for scientific visualization agents. We welcome those who are willing to contribute to the SciVisAgentBench to submit their datasets and cases.
Please visit: [https://kuangshiai.github.io/SciVisAgentBench-data-collection/](https://kuangshiai.github.io/SciVisAgentBench-data-collection/)

## Overview

This website provides:
- **Dashboard**: Display of contributed datasets organized by taxonomy (data sources, data types, visualization tasks)
- **Submission Form**: Comprehensive form for contributors to submit datasets with detailed metadata
- **Contributors Table**: Recognition of community contributors and their contributions

## Features

### Dashboard
- Real-time statistics of total datasets, contributors, and test cases
- Category breakdowns:
  - Data Sources (Medical, Simulations, Molecular Dynamics, etc.)
  - Data Types (Scalar, Vector, Tensor)
  - Visualization Tasks (Isosurface, Streamlines, Tensor visualization, TDA)
- Contributors table showing contributions by institution and category

### Submission Form
The form collects:
- **Contributor Information**: Name, email, institution, ORCID
- **Dataset Metadata**: Name, description
- **Data Classification**:
  - Source (CT/MRI, simulations, molecular dynamics, etc.)
  - Type (scalar, vector, tensor)
  - Visualization tasks (isosurface, volume rendering, streamlines, etc.)
  - Interaction types (zoom, clip, viewpoint, transfer function, etc.)
- **Task Information**:
  - Complexity level (easy, medium, hard)
  - Task description for LLM agents
  - Evaluation criteria and metrics
- **File Uploads**:
  - Source data files
  - Ground truth images (multi-view)
  - Visualization engine state files (ParaView, etc.)
  - Additional metadata

## Technology Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Storage**: LocalStorage (for demonstration; can be replaced with backend)
- **Styling**: Custom CSS with modern design principles
- **No dependencies**: No external libraries required

## Deployment to GitHub Pages

### Option 1: Quick Deployment

1. **Initialize Git Repository** (if not already done):
   ```bash
   cd SciVisAgentBench-data_collection_page
   git init
   git add .
   git commit -m "Initial commit: SciVisAgentBench data collection website"
   ```

2. **Create GitHub Repository**:
   - Go to GitHub and create a new repository named `SciVisAgentBench-data_collection`
   - Don't initialize with README (you already have one)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/SciVisAgentBench-data_collection.git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click on "Settings"
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select "main" branch
   - Click "Save"
   - Your site will be published at: `https://YOUR_USERNAME.github.io/SciVisAgentBench-data_collection/`

### Option 2: Using GitHub Actions (Recommended)

Create a GitHub Actions workflow file:

```bash
mkdir -p .github/workflows
```

Then create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Local Development

To run the website locally:

1. **Simple HTTP Server** (Python):
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser

2. **Using Node.js**:
   ```bash
   npx http-server -p 8000
   ```

3. **Using VS Code**:
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

## Data Storage

Currently, the website uses **LocalStorage** for demonstration purposes. For production use, you should:

1. **Replace with Backend API**:
   - Set up a backend server (Node.js, Python Flask/Django, etc.)
   - Create API endpoints for:
     - `POST /api/submissions` - Submit new dataset
     - `GET /api/submissions` - Get all submissions
     - `GET /api/stats` - Get statistics
   - Update `script.js` to use fetch API instead of localStorage

2. **Database Options**:
   - PostgreSQL or MySQL for relational data
   - MongoDB for document-based storage
   - Firebase for real-time updates
   - Supabase for serverless backend

3. **File Storage**:
   - AWS S3, Google Cloud Storage, or Azure Blob Storage
   - GitHub LFS for large files
   - Institutional data repositories

## Integration with SciVisAgentBench

### Data Export

The website includes an export function accessible from the browser console:

```javascript
exportSubmissions()
```

This downloads all submissions as a JSON file.

### Converting to Benchmark Format

Convert submissions to the YAML format used by the benchmark:

```javascript
// Example conversion (add to script.js)
function convertToYAML(submission) {
    return {
        description: submission.taskDescription,
        vars: {
            datasetPath: submission.datasetName,
            task: submission.visTask,
            complexity: submission.complexity
        },
        assert: [
            {
                type: 'llm-rubric',
                value: submission.evalCriteria
            },
            {
                type: 'image-similarity',
                threshold: 0.8
            }
        ]
    };
}
```

## Customization

### Adding New Data Categories

Edit the form sections in `index.html` and update the statistics calculation in `script.js`:

1. Add new checkboxes/radio buttons in HTML
2. Update `calculateStats()` function in JavaScript
3. Update dashboard display sections

### Styling

Modify `styles.css` to customize:
- Color scheme (CSS variables in `:root`)
- Layout and spacing
- Typography
- Responsive breakpoints

### Form Validation

Add custom validation in `script.js`:

```javascript
function validateSubmission(submission) {
    // Add your custom validation logic
    if (!submission.contributorEmail.includes('@')) {
        return false;
    }
    return true;
}
```

## Security Considerations

For production deployment:

1. **Input Sanitization**: All user inputs are escaped before display
2. **File Upload Validation**: Implement server-side validation
3. **HTTPS**: Always use HTTPS for production
4. **API Authentication**: Add authentication for backend API
5. **Rate Limiting**: Prevent spam submissions
6. **CORS**: Configure properly if using separate backend

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Contributing

To contribute to this website:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is released under CC BY 4.0 License.

## Contact

For questions or collaboration:
- GitHub: [https://github.com/KuangshiAi/SciVisAgentBench](https://github.com/KuangshiAi/SciVisAgentBench)
- Position Paper: See repository for latest paper

## Acknowledgments

This project is a collaboration between:
- University of Notre Dame
- Lawrence Livermore National Laboratory
- Vanderbilt University

Prepared by LLNL under Contract DE-AC52-07NA27344.
