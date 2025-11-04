# Contributing to SciVisAgentBench

Thank you for your interest in contributing to SciVisAgentBench! This document provides guidelines for contributing datasets to our benchmark.

## How to Contribute

### 1. Dataset Contribution

We welcome contributions of scientific visualization datasets across various domains:

#### Data Sources We're Looking For:
- **Medical Imaging**: CT scans, MRI, microscopy images (2D/3D/4D)
- **Physical/Fluid Simulations**: CFD, weather simulations, combustion, etc.
- **Molecular Dynamics**: Protein structures, molecular simulations
- **Other Scientific Data**: Astronomy, geology, climate data, etc.

#### What Makes a Good Contribution:

**Data Quality**:
- Well-documented dataset with clear provenance
- Appropriate resolution and size (not too small, not excessively large)
- Clean data without artifacts (or artifacts are scientifically relevant)

**Task Description**:
- Clear, unambiguous natural language description
- Specific visualization goal or scientific question
- Can be evaluated objectively

**Complexity Levels**:
- **Easy**: Single visualization operation (e.g., "Create an isosurface at value 128")
- **Medium**: Multi-step workflow (e.g., "Load data, apply gradient filter, create streamlines, color by velocity magnitude")
- **Hard**: Complex analysis requiring domain knowledge (e.g., "Identify and visualize all vortex cores in the flow field")

### 2. Using the Submission Form

Visit the [submission page](#submit) and fill out all required fields:

#### Contributor Information
- Your name and email (for attribution and communication)
- Institution affiliation
- ORCID (optional but recommended)

#### Dataset Metadata
- **Name**: Short, descriptive name
- **Description**: Detailed description including:
  - What the data represents
  - How it was generated/acquired
  - Physical domain and units
  - Resolution and dimensions
  - Any relevant publications

#### Classification
Select appropriate categories for:
- Data source type
- Data type (scalar/vector/tensor)
- Applicable visualization techniques
- Required interactions

#### Task Information
- **Task Description**: Write as if instructing a human expert
  - Be specific about desired outcomes
  - Include relevant parameters (isovalue, color mapping, etc.)
  - Mention expected visual features

- **Evaluation Criteria**: How should the output be judged?
  - Visual quality metrics
  - Correctness criteria (specific features, colors, structures)
  - Quantitative thresholds if applicable

#### File Uploads

**Required**:
- **Source Data**: VTK, NIfTI, or other standard formats
- **Ground Truth Images**: Multiple viewpoints showing expected result
  - Include at least 3 different camera angles
  - High resolution (at least 1024x1024)
  - Consistent lighting and rendering settings

**Optional but Recommended**:
- **Visualization Engine State**: ParaView state file (.pvsm) or equivalent
- **Metadata File**: JSON/YAML with additional information:
  ```json
  {
    "physical_domain": "fluid dynamics",
    "spatial_resolution": [256, 256, 256],
    "time_steps": 100,
    "variables": ["velocity", "pressure", "temperature"],
    "units": {
      "velocity": "m/s",
      "pressure": "Pa"
    }
  }
  ```

### 3. Example Contributions

#### Example 1: Simple Isosurface Task

**Dataset**: Brain MRI scan
**Task**: "Create an isosurface visualization of the brain at intensity value 100. Color the surface in light gray."
**Complexity**: Easy
**Evaluation**:
- Isosurface exists at correct value (5 pts)
- Correct color applied (5 pts)
- Proper lighting and shading (5 pts)

#### Example 2: Vector Field Visualization

**Dataset**: CFD simulation of flow past cylinder
**Task**: "Visualize the velocity field using streamlines. Seed streamlines uniformly in front of the cylinder. Color streamlines by velocity magnitude using a rainbow colormap."
**Complexity**: Medium
**Evaluation**:
- Streamlines properly seeded (10 pts)
- Correct color mapping (10 pts)
- Visual clarity and aesthetics (5 pts)

#### Example 3: Complex Multi-Modal Task

**Dataset**: Time-varying molecular dynamics
**Task**: "Identify stable protein configurations in the trajectory. For each stable state, create a surface representation colored by hydrophobicity. Show the transition path between the two most stable states."
**Complexity**: Hard
**Evaluation**:
- Correct identification of stable states (15 pts)
- Proper surface generation and coloring (10 pts)
- Accurate transition path (10 pts)
- Overall insight quality (5 pts)

### 4. Evaluation Guidelines

#### Using LLM-as-a-Judge
When specifying evaluation criteria for LLM judges:
- Be specific and measurable
- Break down into multiple sub-criteria
- Assign point values to each criterion
- Include both objective and subjective elements

Example:
```
1. Overall visualization quality (0-10 pts)
2. Correct rendering technique used (0-10 pts)
3. Appropriate color mapping (0-10 pts)
4. Scientifically accurate representation (0-10 pts)
5. Visual clarity and aesthetics (0-10 pts)
```

#### Quantitative Metrics
Consider including:
- **Image similarity**: PSNR, SSIM, LPIPS against ground truth
- **Geometric accuracy**: Mesh quality, topology correctness
- **Numerical validation**: Extracted values match expected results

### 5. Data Licensing

By submitting data, you agree to:
- Release the dataset under **CC BY 4.0** license
- Confirm you have rights to share the data
- Provide proper attribution if data is from published work

### 6. Quality Checklist

Before submitting, verify:
- [ ] Dataset is scientifically valid and properly documented
- [ ] Task description is clear and unambiguous
- [ ] Ground truth images show expected result from multiple angles
- [ ] Evaluation criteria are specific and measurable
- [ ] All required files are included
- [ ] Data can be loaded in standard visualization tools
- [ ] You have rights to share this data

### 7. After Submission

What happens next:
1. **Review**: Your submission will be reviewed for completeness and quality
2. **Integration**: Approved datasets are integrated into the benchmark
3. **Attribution**: You'll be credited as a contributor
4. **Publication**: Contributions may be included in benchmark publications

### 8. Getting Help

If you need assistance:
- Open an issue on [GitHub](https://github.com/KuangshiAi/SciVisAgentBench)
- Review existing contributions for examples
- Check the documentation for technical details

## Dataset Taxonomy

### Data Sources
- **Medical**: CT, MRI, microscopy, histology
- **Simulation**: CFD, FEM, particle systems, weather
- **Molecular**: MD simulations, protein structures, chemical reactions
- **Observational**: Astronomy, seismology, remote sensing
- **Synthetic**: Generated test cases, mathematical functions

### Data Types
- **Scalar**: Single value per point (temperature, density, concentration)
- **Vector**: Direction and magnitude (velocity, force, gradient)
- **Tensor**: Multi-dimensional matrices (stress, strain, diffusion)

### Visualization Tasks
- **Scalar**: Isosurfaces, volume rendering, contours, TDA
- **Vector**: Streamlines, arrows, LIC, critical points
- **Tensor**: Glyphs, hyperstreamlines, eigenvalue analysis

### Complexity Levels
- **Easy**: 1-2 operations, clear solution
- **Medium**: 3-5 operations, requires planning
- **Hard**: >5 operations, domain expertise needed

## Best Practices

### Task Descriptions
✅ **Good**: "Create a volume rendering of the brain MRI. Adjust the transfer function to show the skull in white (opacity 0.3), gray matter in gray (opacity 0.6), and white matter in light beige (opacity 0.8). Set the camera to show a lateral view."

❌ **Bad**: "Make a nice visualization of the brain."

### Evaluation Criteria
✅ **Good**: "1) Correct transfer function with 3 distinct regions (15 pts), 2) Skull visibility and color (5 pts), 3) Gray matter representation (5 pts), 4) White matter representation (5 pts), 5) Camera position showing lateral anatomy (5 pts)"

❌ **Bad**: "Looks good."

### Ground Truth Images
✅ **Good**: High-resolution images from front, side, and top views, consistent rendering settings, clear features

❌ **Bad**: Single low-resolution screenshot, poor lighting, unclear what should be visible

## Thank You!

Your contributions help build a comprehensive benchmark that will advance the field of autonomous scientific visualization. Every dataset helps improve agent capabilities and drives innovation in this space.

---

For questions or suggestions about these guidelines, please open an issue on GitHub.
