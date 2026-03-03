# SciVisAgentBench - Comprehensive Statistics Report
*Generated from 5 CSV files in the benchmark*
---
## 1. Total Cases Count
**Important**: Cases = Tasks + Workflows only (Operation-level entries are NOT counted as cases)

### Overall Summary
- **Total Tasks**: 68
- **Total Workflows**: 53
- **Total Cases**: **121** (Tasks + Workflows)

### Breakdown by File
| File | Tasks | Workflows | Cases (Task+Workflow) | Total Operations |
|------|-------|-----------|----------------------|-----------------|
| bioimage_data | 11 | 4 | **15** | 50 |
| molecular_vis | 13 | 2 | **15** | 54 |
| sci_volume_data | 34 | 0 | **34** | 68 |
| topology | 0 | 9 | **9** | 27 |
| paraview | 10 | 38 | **48** | 169 |
| **TOTAL** | **68** | **53** | **121** | **368** |

## 2. Application Domain Statistics
**Note**: These statistics include ONLY cases (Tasks + Workflows). Operation-level entries are excluded.

### Individual Application Counts
*(Counts individual tags, so multi-tagged entries contribute to multiple categories)*

| Application | Count |
|-------------|-------|
| Biology | 28 |
| Others | 27 |
| Physics | 26 |
| Chemistry | 17 |
| Medical Science | 14 |
| Mathematics | 9 |
| Astronomy | 4 |
| Earth System Science | 4 |

**Total individual application tags**: 129

### Application Combinations
*(Shows exact combinations as they appear in the data)*

| Application Combination | Count |
|------------------------|-------|
| Others | 27 |
| Biology | 26 |
| Physics | 24 |
| Chemistry | 14 |
| Medical Science | 13 |
| Astronomy | 4 |
| Mathematics | 3 |
| Chemistry; Biology | 2 |
| Physics; Mathematics | 2 |
| Earth System Science; Mathematics | 2 |
| Earth System Science | 2 |
| Medical Science; Mathematics | 1 |
| Chemistry; Mathematics | 1 |

## 3. Data Type Statistics
**Note**: These statistics include ONLY cases (Tasks + Workflows). Operation-level entries are excluded.

### Individual Data Type Counts
*(Counts individual tags, so multi-tagged entries contribute to multiple categories)*

| Data Type | Count |
|-----------|-------|
| Scalar Fields | 74 |
| Time-varying | 16 |
| Vector Fields | 16 |
| Scalar Field | 15 |
| Multivariate | 15 |
| Multi-variate | 15 |
| Tensor Fields | 2 |

**Total individual data type tags**: 153

### Data Type Combinations
*(Shows exact combinations as they appear in the data)*

| Data Type Combination | Count |
|-----------------------|-------|
| Scalar Fields | 71 |
| Multi-variate | 15 |
| Vector Fields | 12 |
| Scalar Field; Multivariate; Time-varying | 11 |
| Scalar Field; Multivariate | 4 |
| Vector Fields; Time-varying | 3 |
| Tensor Fields | 2 |
| Scalar Fields; Time-varying | 2 |
| Scalar Fields; Vector Fields | 1 |

## 4. Task Level 1: Complexity Level Statistics

### Overall Distribution
| Complexity Level | Entry Count | Counted as Case? |
|------------------|-------------|------------------|
| Task | 68 | ✅ YES |
| Workflow | 53 | ✅ YES |
| **Total Cases** | **121** | **(Tasks + Workflows)** |

## 5. Task Level 2: Visualization Operations Statistics
**Note**: These statistics include ONLY cases (Tasks + Workflows). Operation-level entries are excluded.

### All Visualization Operations (Sorted by Frequency)
| Rank | Visualization Operation | Total Count |
|------|------------------------|-------------|
| 1 | Color & Opacity Mapping | 95 |
| 2 | View & Camera Control | 57 |
| 3 | Volume Rendering | 51 |
| 4 | Surface & Contour Extraction | 30 |
| 5 | Data Subsetting & Extraction | 20 |
| 6 | Field Computation | 19 |
| 7 | Glyph & Marker Placement | 19 |
| 8 | Temporal Processing | 17 |
| 9 | Dataset Restructuring | 10 |
| 10 | Feature Identification & Segmentation | 10 |
| 11 | Data Smoothing & Filtering | 7 |
| 12 | Scientific Insight Derivation | 7 |
| 13 | Plot & Chart Generation | 3 |
| 14 | Data Sampling & Resolution Control | 2 |
| 15 | Geometric & Topological Transformation | 1 |

**Total visualization operation tags**: 348

### Top 10 Most Common Visualization Operations
| Rank | Operation | Count |
|------|-----------|-------|
| 1 | Color & Opacity Mapping | 95 |
| 2 | View & Camera Control | 57 |
| 3 | Volume Rendering | 51 |
| 4 | Surface & Contour Extraction | 30 |
| 5 | Data Subsetting & Extraction | 20 |
| 6 | Field Computation | 19 |
| 7 | Glyph & Marker Placement | 19 |
| 8 | Temporal Processing | 17 |
| 9 | Dataset Restructuring | 10 |
| 10 | Feature Identification & Segmentation | 10 |

### Visualization Operations by Complexity Level (Cases Only)

#### Task Level (Top 10)
| Rank | Operation | Count |
|------|-----------|-------|
| 1 | Color & Opacity Mapping | 54 |
| 2 | Volume Rendering | 36 |
| 3 | Data Subsetting & Extraction | 14 |
| 4 | View & Camera Control | 14 |
| 5 | Surface & Contour Extraction | 10 |
| 6 | Glyph & Marker Placement | 7 |
| 7 | Field Computation | 6 |
| 8 | Dataset Restructuring | 5 |
| 9 | Temporal Processing | 3 |
| 10 | Data Smoothing & Filtering | 1 |

#### Workflow Level (Top 10)
| Rank | Operation | Count |
|------|-----------|-------|
| 1 | View & Camera Control | 43 |
| 2 | Color & Opacity Mapping | 41 |
| 3 | Surface & Contour Extraction | 20 |
| 4 | Volume Rendering | 15 |
| 5 | Temporal Processing | 14 |
| 6 | Field Computation | 13 |
| 7 | Glyph & Marker Placement | 12 |
| 8 | Feature Identification & Segmentation | 10 |
| 9 | Scientific Insight Derivation | 7 |
| 10 | Data Subsetting & Extraction | 6 |

## 6. Summary Statistics
- **Total number of CSV files analyzed**: 5
- **Total Cases (Tasks + Workflows)**: **121**
- **Unique application domains**: 8
- **Unique data types**: 7
- **Unique visualization operations**: 15

### File Contributions
| File | Cases Contributed | Percentage |
|------|-------------------|------------|
| paraview | 48 | 39.7% |
| sci_volume_data | 34 | 28.1% |
| bioimage_data | 15 | 12.4% |
| molecular_vis | 15 | 12.4% |
| topology | 9 | 7.4% |

