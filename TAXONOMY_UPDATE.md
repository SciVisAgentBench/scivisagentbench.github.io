# Taxonomy Update Summary

This document describes the major changes made to the SciVisAgentBench data collection website based on the new Data & Task Taxonomy specification.

## Overview

The website has been completely redesigned to align with the formal taxonomy structure for scientific visualization datasets and tasks. The key change is moving from ad-hoc categories to a structured, hierarchical taxonomy system.

## Dashboard Changes

### Previous Dashboard Categories
- Data Sources (Medical, Simulation, Molecular, Other)
- Data Types (Scalar, Vector, Tensor)
- Visualization Tasks (Isosurface, Streamlines, Tensor, TDA, TDI, Interaction, Time-Varying, Other)

### New Dashboard Categories (2nd Level Only)

**1. Attribute Types**
- Scalar Fields
- Vector Fields
- Tensor Fields
- Multi-variate/Multi-field

**2. Atomic Operations**
- Extraction & Subsetting
- Geometry & Topology Transformation
- Attribute Computation & Derivation
- Representation & Mapping
- Smoothing & Enhancement

**3. Workflow Tasks**
- Data Understanding & Exploration
- Analysis & Quantification
- Feature Extraction & Tracking
- Comparative & Temporal Analysis
- Flow & Transport Analysis
- Verification & Validation
- Data Processing & Optimization
- Communication & Dissemination
- Scientific Insights

### Dynamic Display
The dashboard now **only shows categories with count > 0**. Empty categories are hidden, displaying "No data yet" if all categories are empty. This provides a cleaner, more focused view.

## Submit Form Changes

### Data Taxonomy (3rd Level Detail)

#### 1. Application Domain (Data Source)
Unchanged conceptually but expanded options:
- Climate Data
- SEM Image Data
- CT Scan for Objects
- Medical/CT/MRI Scan
- Simulation Data
- Molecular Data
- Other (with text field)

#### 2. Data Type (3rd Level - Structured Hierarchy)
**Structured Data:**
- Image Data (uniform rectilinear grids)
- Rectilinear Grids
- Structured Grids (curvilinear)
- AMR (Adaptive Mesh Refinement)

**Unstructured Data:**
- Unstructured Grids (arbitrary cell types)
- Polygonal Data (surfaces, meshes)
- Point Clouds

**Specialized Types:**
- Hyper-tree Grids
- Composite/Multi-block Datasets
- Graph/Network Data

#### 3. Temporal Dimension (Required, 3rd Level)
- Static/Single-Timestep
- Time-Series (multiple discrete steps)
- Time-Dependent Processing (interpolation, particle tracing)

#### 4. Attribute Types (Required, 3rd Level)
- Scalar Fields (temperature, pressure, density)
- Vector Fields (velocity, force, displacement)
- Tensor Fields (stress, strain, diffusion tensors)
- Multi-variate/Multi-field (multiple scalar/vector fields)

### Task Taxonomy (2nd Level Only)

Replaced previous "Visualization-Specific Tasks" section with structured taxonomy:

#### Atomic Operations
- Extraction & Subsetting
- Geometry & Topology Transformation
- Attribute Computation & Derivation
- Representation & Mapping
- Smoothing & Enhancement

#### Workflow
- Data Understanding & Exploration
- Analysis & Quantification
- Feature Extraction & Tracking
- Comparative & Temporal Analysis
- Flow & Transport Analysis
- Verification & Validation
- Data Processing & Optimization
- Communication & Dissemination

#### Scientific Insights
- Scientific Insights (application-specific questions derived from analysis)

### Removed Sections
- **Interaction & Manipulation** - This is now implicit in the task taxonomy (e.g., Data Understanding & Exploration)
- **Visualization-Specific Tasks** - Replaced by the hierarchical task taxonomy

## JavaScript Changes

### State Management
Updated `appState` structure:
```javascript
stats: {
    attributeTypes: {
        'scalar-fields': 0,
        'vector-fields': 0,
        'tensor-fields': 0,
        'multivariate': 0
    },
    atomicOperations: { /* 5 categories */ },
    workflowTasks: { /* 9 categories */ }
}
```

### Form Handling
- Updated to collect new taxonomy fields: `applicationDomain`, `dataType`, `temporalDimension`, `attributeType`, `taskTaxonomy`
- Removed old fields: `dataSource`, `visTask`, `interaction`
- Validation updated to require new fields

### Statistics Calculation
- `calculateStats()` now processes `attributeType` and `taskTaxonomy` arrays
- Dynamic filtering: only displays categories with count > 0

### Contributors Table
- Updated to use `applicationDomain` instead of `dataSource` for subject tracking

## Sample Data

Updated sample submissions to demonstrate the new taxonomy:

1. **Cardiac MRI Isosurface**
   - Data Type: Image Data
   - Temporal: Static
   - Attribute: Scalar Fields
   - Tasks: Extraction & Subsetting, Representation & Mapping, Data Exploration

2. **CFD Flow Analysis**
   - Data Type: Structured Grids
   - Temporal: Time-Series
   - Attribute: Vector Fields
   - Tasks: Attribute Computation, Representation & Mapping, Flow & Transport, Feature Extraction

3. **Brain Tumor Segmentation**
   - Data Type: Image Data
   - Temporal: Static
   - Attribute: Scalar Fields
   - Tasks: Extraction & Subsetting, Analysis & Quantification, Representation & Mapping

4. **Molecular Stress Tensor Analysis**
   - Data Type: Unstructured Grids
   - Temporal: Time-Dependent
   - Attribute: Tensor Fields
   - Tasks: Attribute Computation, Representation & Mapping, Comparative & Temporal

## Validation

Required fields now include:
- All previous contributor and dataset fields
- **NEW**: `temporalDimension` (required)
- **NEW**: At least one `dataType` (3rd level)
- **NEW**: At least one `attributeType` (3rd level)
- **NEW**: At least one `taskTaxonomy` (2nd level)

## Benefits of New Taxonomy

1. **Hierarchical Structure**: Clear 3-level (Data) and 2-level (Task) hierarchy provides better organization
2. **Comprehensive Coverage**: Covers more data types and task categories than previous ad-hoc system
3. **Standardization**: Aligns with scientific visualization literature and practice
4. **Dynamic Dashboard**: Only shows active categories, reducing clutter
5. **Better Classification**: More precise categorization of datasets and tasks
6. **Research Alignment**: Matches the formal taxonomy in the SciVisAgentBench paper

## Migration Notes

### For Existing Submissions
If you have existing submissions in localStorage, they will not display in the new dashboard because they lack the new required fields. To migrate:

1. Clear localStorage: `localStorage.clear()`
2. Load sample data to see new format: Uncomment `loadSampleData()` in `script.js`
3. Or manually convert old submissions to new format

### For Contributors
- More detailed data type specification required (3rd level)
- Must specify temporal dimension
- Must specify attribute types
- Task taxonomy is now more structured (2nd level categories)

## Files Modified

1. **index.html**: Dashboard structure, submit form sections completely redesigned
2. **script.js**: State management, statistics calculation, form handling, validation, sample data
3. **styles.css**: No changes needed (existing styles work with new structure)

## Next Steps

1. Test form submission with new taxonomy
2. Verify dashboard updates correctly with new data
3. Update documentation (README.md, CONTRIBUTING.md) to reflect new taxonomy
4. Consider adding taxonomy help/tooltips in the form
5. Update DATA_FORMAT.md to reflect new JSON structure
