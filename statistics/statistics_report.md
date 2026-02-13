# SciVisAgentBench - Comprehensive Statistics Report
*Generated from 6 CSV files in the benchmark*
---
## 1. Total Cases Count
**Important**: Cases = Tasks + Workflows only (Operation-level entries are NOT counted as cases)

### Overall Summary
- **Total Tasks**: 100
- **Total Workflows**: 37
- **Total Cases**: **137** (Tasks + Workflows)
- **Total Actions**: **632** (sum of Action Count column)

### Breakdown by File
| File | Operation Entries | Tasks | Workflows | Cases (Task+Workflow) |
|------|-------------------|-------|-----------|----------------------|
| molecular_vis | 42 | 13 | 2 | **15** |
| bioimage_data | 30 | 11 | 14 | **25** |
| sci_volume_data | 0 | 39 | 0 | **39** |
| chatvis_bench | 0 | 15 | 5 | **20** |
| main | 0 | 22 | 10 | **32** |
| topology | 0 | 0 | 6 | **6** |
| **TOTAL** | **72** | **100** | **37** | **137** |

## 2. Application Domain Statistics
**Note**: These statistics include ONLY cases (Tasks + Workflows). Operation-level entries are excluded.


### Individual Application Counts
*(Counts individual tags, so multi-tagged entries contribute to multiple categories)*

| Application | Count |
|-------------|-------|
| Biology | 38 |
| Physics | 38 |
| Others | 17 |
| Chemistry | 16 |
| Medical Science | 14 |
| Mathematics | 13 |
| Astronomy | 5 |
| Earth System Science | 3 |

**Total individual application tags**: 144

### Application Combinations
*(Shows exact combinations as they appear in the data)*

| Application Combination | Count |
|------------------------|-------|
| Biology | 36 |
| Physics | 36 |
| Others | 17 |
| Chemistry | 14 |
| Medical Science | 13 |
| Mathematics | 8 |
| Astronomy | 5 |
| Chemistry; Biology | 2 |
| Earth System Science; Mathematics | 2 |
| Earth System Science | 1 |
| Mathematics; Physics | 1 |
| Medical Science; Mathematics | 1 |
| Physics; Mathematics | 1 |

## 3. Data Type Statistics
**Note**: These statistics include ONLY cases (Tasks + Workflows). Operation-level entries are excluded.


### Individual Data Type Counts
*(Counts individual tags, so multi-tagged entries contribute to multiple categories)*

| Data Type | Count |
|-----------|-------|
| Scalar Field | 97 |
| Multivariate | 42 |
| Vector Field | 21 |
| Time-varying | 13 |
| Tensor Field | 2 |

**Total individual data type tags**: 175

### Data Type Combinations
*(Shows exact combinations as they appear in the data)*

| Data Type Combination | Count |
|-----------------------|-------|
| Scalar Field | 70 |
| Vector Field | 21 |
| Multivariate | 17 |
| Scalar Field; Multivariate | 14 |
| Scalar Field; Multivariate; Time-varying | 11 |
| Scalar Field; Time-varying | 2 |
| Tensor Field | 2 |

## 4. Task Level 1: Complexity Level Statistics

### Overall Distribution
| Complexity Level | Entry Count | Action Count | Counted as Case? |
|------------------|-------------|-----------------|------------------|
| Operation | 72 | N/A | ❌ NO |
| Task | 100 | 413 | ✅ YES |
| Workflow | 37 | 219 | ✅ YES |
| **Total Cases** | **137** | **632** | **(Tasks + Workflows)** |

## 5. Task Level 2: Visualization Operations Statistics
**Note**: These statistics include ONLY cases (Tasks + Workflows). Operation-level entries are excluded.


### All Visualization Operations (Sorted by Frequency)
| Rank | Visualization Operation | Total Count |
|------|------------------------|-------------|
| 1 | Color & Opacity Mapping | 95 |
| 2 | Surface & Contour Extraction | 66 |
| 3 | Volume Rendering | 55 |
| 4 | View & Camera Control | 41 |
| 5 | Field Computation | 29 |
| 6 | Data Subsetting & Extraction | 23 |
| 7 | Scientific Insight Derivation | 19 |
| 8 | Glyph & Marker Placement | 17 |
| 9 | Dataset Restructuring | 15 |
| 10 | Temporal Processing | 12 |
| 11 | Feature Identification & Segmentation | 7 |
| 12 | Data Smoothing & Filtering | 5 |
| 13 | Plot & Chart Generation | 3 |
| 14 | Data Sampling & Resolution Control | 2 |
| 15 | Geometric & Topological Transformation | 2 |

**Total visualization operation tags**: 391

### Top 10 Most Common Visualization Operations
| Rank | Operation | Count |
|------|-----------|-------|
| 1 | Color & Opacity Mapping | 95 |
| 2 | Surface & Contour Extraction | 66 |
| 3 | Volume Rendering | 55 |
| 4 | View & Camera Control | 41 |
| 5 | Field Computation | 29 |
| 6 | Data Subsetting & Extraction | 23 |
| 7 | Scientific Insight Derivation | 19 |
| 8 | Glyph & Marker Placement | 17 |
| 9 | Dataset Restructuring | 15 |
| 10 | Temporal Processing | 12 |

### Visualization Operations by Complexity Level (Cases Only)

#### Task Level (Top 10)
| Rank | Operation | Count |
|------|-----------|-------|
| 1 | Color & Opacity Mapping | 75 |
| 2 | Surface & Contour Extraction | 55 |
| 3 | Volume Rendering | 51 |
| 4 | View & Camera Control | 28 |
| 5 | Data Subsetting & Extraction | 18 |
| 6 | Field Computation | 15 |
| 7 | Glyph & Marker Placement | 12 |
| 8 | Dataset Restructuring | 9 |
| 9 | Temporal Processing | 6 |
| 10 | Plot & Chart Generation | 3 |

#### Workflow Level (Top 10)
| Rank | Operation | Count |
|------|-----------|-------|
| 1 | Color & Opacity Mapping | 20 |
| 2 | Scientific Insight Derivation | 19 |
| 3 | Field Computation | 14 |
| 4 | View & Camera Control | 13 |
| 5 | Surface & Contour Extraction | 11 |
| 6 | Feature Identification & Segmentation | 7 |
| 7 | Dataset Restructuring | 6 |
| 8 | Temporal Processing | 6 |
| 9 | Data Subsetting & Extraction | 5 |
| 10 | Glyph & Marker Placement | 5 |

### Complete Taxonomy of 15 Operation Categories

All visualization operations found in the benchmark:

1. **Color & Opacity Mapping** (95 occurrences)
2. **Data Sampling & Resolution Control** (2 occurrences)
3. **Data Smoothing & Filtering** (5 occurrences)
4. **Data Subsetting & Extraction** (23 occurrences)
5. **Dataset Restructuring** (15 occurrences)
6. **Feature Identification & Segmentation** (7 occurrences)
7. **Field Computation** (29 occurrences)
8. **Geometric & Topological Transformation** (2 occurrences)
9. **Glyph & Marker Placement** (17 occurrences)
10. **Plot & Chart Generation** (3 occurrences)
11. **Scientific Insight Derivation** (19 occurrences)
12. **Surface & Contour Extraction** (66 occurrences)
13. **Temporal Processing** (12 occurrences)
14. **View & Camera Control** (41 occurrences)
15. **Volume Rendering** (55 occurrences)

## 6. Summary Statistics
- **Total number of CSV files analyzed**: 6
- **Total rows in all files**: 209
- **Total Cases (Tasks + Workflows)**: **137**
- **Unique application domains**: 8
- **Unique data types**: 5
- **Unique visualization operations**: 15

### File Contributions
| File | Cases Contributed | Percentage |
|------|-------------------|------------|
| sci_volume_data | 39 | 28.5% |
| main | 32 | 23.4% |
| bioimage_data | 25 | 18.2% |
| chatvis_bench | 20 | 14.6% |
| molecular_vis | 15 | 10.9% |
| topology | 6 | 4.4% |
