# Application Taxonomy

- Astronomy
- Medical Science
- Biology
- Physics
- Earth System Science
- Mathematics
- Chemistry
- Others




# Data Type Taxonomy

- Scalar Fields
- Vector Fields
- Tensor Fields
- Multivariate
- Time-varying


# Task Level 1: Complexity Level Taxonomy

- **Operation** - Single, focused visualization operation
- **Task** - Small-scale visualization task involving a few operations
- **Workflow** - Multi-step visualization pipeline or complex process


# Task Level 2: Visualization Operations Taxonomy

Each task in SciVisAgentBench is tagged with one or more of the following operations. These tags describe **what visualization or data processing actions** are performed.

---

## 1. Data Subsetting & Extraction

**Brief:** Isolate spatial regions or value-based subsets from a dataset.

**Detailed:** This operation covers methods of filtering data to focus on a region or set of values of interest. It includes spatial subsetting such as clipping by plane, box, or sphere; extracting a volume of interest (VOI) from structured data; selecting by point or cell IDs; thresholding to filter by scalar range; isocontouring or isosurfacing to extract constant-value boundaries; and connectivity filtering to isolate connected components. The common thread is that the operation reduces the dataset to a subset defined by spatial location or attribute value.

---

## 2. Data Sampling & Resolution Control

**Brief:** Modify data density or sampling resolution for efficiency or clarity.

**Detailed:** This operation covers methods that change how densely data is represented while preserving its overall semantics. It includes subsampling and decimation to reduce point or cell count, resampling onto different grids, probing fields at discrete user-specified locations, and generating reduced representations for performance or visual clarity. Unlike Data Subsetting & Extraction (which selects regions of interest), this operation controls the fidelity or granularity of the entire dataset or a uniformly sampled portion of it.

---

## 3. Surface & Contour Extraction

**Brief:** Generate isosurfaces, contour lines, or cut-plane slices from volumetric data.
Generate isosurfaces, contour lines, ribbons, or tubes from volumetric data.

**Detailed:** This operation covers the extraction of geometric primitives that represent boundaries or cross-sections within a volume. It includes isosurface generation at user-specified scalar thresholds, contour line or contour surface extraction, slicing or cutting along a plane to produce a 2D cross-section, and generation of ribbons, tubes, or streamline geometry from curve data. Unlike Data Subsetting & Extraction (which filters data), this operation creates new geometry that represents a specific feature boundary or spatial cross-section of the original volume.

---

## 4. Volume Rendering

**Brief:** Render volumetric data directly using ray casting or splatting.

**Detailed:** This operation covers techniques that visualize an entire 3D volume without reducing it to a surface. It includes ray-casting volume rendering, point splatting, and the definition or adjustment of transfer functions that map scalar values to color and opacity. Multi-channel volume rendering with additive blending or X-ray style transparency also falls here. The key characteristic is that the full volume participates in the visual output, as opposed to extracting a surface or slice.

---

## 5. Glyph & Marker Placement

**Brief:** Place oriented, scaled, or typed glyphs at data points to encode local attributes.

**Detailed:** This operation covers the generation and placement of glyphs at sample locations to encode one or more data attributes visually. It includes oriented glyphs such as arrows or cones for vector direction, scaled glyphs where symbol size maps to magnitude, tensor glyphs such as ellipsoids or superquadrics, and volume markers or seed points. It also covers molecular representation types — spheres (van der Waals), sticks (licorice), cartoons (backbone), and surfaces — which are all glyph-style encodings of atomic or residue-level data. The defining feature is that discrete symbols are placed at specific locations to represent local data values.

---

## 6. Color & Opacity Mapping

**Brief:** Assign colors, opacity, or textures to data elements based on attribute values.

**Detailed:** This operation covers all mappings from data attributes to visual properties. It includes scalar-to-color mapping using colormaps (e.g., viridis, rainbow, grayscale), opacity or transparency mapping across a scalar range, texture coordinate generation and texture application, material property assignment such as shininess or ambient light, and contrast or gamma adjustments for display. In molecular visualization, coloring by element, chain, residue type, B-factor, charge, or hydrophobicity are all instances of this operation. The key distinction from Volume Rendering or Glyph Placement is that this operation defines the visual encoding rule, not the geometry.

---

## 7. Geometric & Topological Transformation

**Brief:** Modify the geometry or connectivity structure of a dataset.

**Detailed:** This operation covers transformations that change the shape, position, or topological structure of data without computing new scalar or vector attributes. Geometric transforms include translation, rotation, scaling, deformation, and warping of vertices. Topological transforms include triangulation or tessellation of polygons, mesh refinement or coarsening, cell-type conversion, and boundary extraction (deriving a surface mesh from a volume). These operations alter how the data is structured spatially but do not derive new field values.

---

## 8. Dataset Restructuring

**Brief:** Combine, partition, or reorganize multiple datasets or data blocks.

**Detailed:** This operation covers structural changes to how datasets are organized at the block or file level, rather than modifying geometry or attributes. It includes merging two or more datasets into a single output, appending new data blocks, splitting or partitioning a dataset along boundaries, and format or type conversion between file structures (e.g., structured to unstructured grid). The defining characteristic is that the operation reorganizes data provenance or container structure rather than transforming geometry or computing attributes.

---

## 9. Field Computation

**Brief:** Derive new scalar, vector, or tensor fields from existing data attributes.

**Detailed:** This operation covers all calculations that produce new attribute arrays from existing ones. It includes gradient, divergence, curl, and vorticity computation; curvature calculation and normal generation; arithmetic operations on fields such as addition, subtraction, and multiplication; vector magnitude computation and component extraction; field aggregation and statistical summaries (min, max, mean, standard deviation); tensor operations such as eigenvalue and eigenvector decomposition; interpolation between fields; and distance computations. Critical point detection also falls here, as it derives point locations and classifications from scalar field topology.

---

## 10. Temporal Processing

**Brief:** Perform computations or navigation that involve the time dimension of data.

**Detailed:** This operation covers all actions that explicitly use or traverse the temporal axis of time-varying data. It includes temporal interpolation between timesteps, particle tracing or trajectory computation through time, flow integration to produce streamlines, pathlines, streaklines, or timelines, temporal statistics or aggregation across multiple timesteps, flow map computation, and navigating or selecting specific timesteps in a time series. The defining feature is that time is an active dimension in the operation, distinguishing it from static spatial analysis.

---

## 11. Feature Identification & Segmentation (Or Feature Extraction & Tracking?)

**Brief:** Detect, extract, or label discrete structures or regions in data.

**Detailed:** This operation covers computational methods that identify and classify meaningful structures within a dataset. It includes connected component labeling, object detection and identification, region segmentation, feature extraction such as vortices or boundaries, topology-based feature classification (e.g., critical point types), and tissue or structure classification from intensity distributions. The output is a set of labeled objects or regions — a computational result — as distinct from Scientific Insight Derivation, which interprets those results to answer a domain question.

---

## 12. Data Smoothing & Filtering

**Brief:** Reduce noise, enhance features, or apply statistical filters to data.

**Detailed:** This operation covers preprocessing steps that modify attribute values to improve quality or visual clarity without changing geometry or topology. It includes surface smoothing algorithms such as Laplacian or Gaussian smoothing, noise reduction on scalar or vector fields, interpolation to fill missing data gaps, edge enhancement or detection, feature sharpening, outlier removal, and statistical filtering. The goal is to condition the data for cleaner analysis or visualization, as distinct from Field Computation which derives fundamentally new quantities.

---

## 13. View & Camera Control

**Brief:** Adjust camera position, orientation, zoom, or lighting for the visualization.

**Detailed:** This operation covers all manipulations of the viewing context rather than the data itself. It includes camera rotation, zoom, and panning; setting specific viewpoints such as isometric, orthographic, or axis-aligned views; adjusting light position and lighting mode; switching between 2D and 3D view modes; and resetting the camera to default. In molecular visualization, this includes centering on a specific residue or region and adjusting the viewing angle to show a particular structural feature.

---

## 14. Plot & Chart Generation

**Brief:** Produce 2D statistical plots, histograms, or line charts from data.

**Detailed:** This operation covers the creation of traditional 2D chart representations from dataset attributes. It includes histogram generation from scalar distributions, line plot extraction, such as intensity profiles or time series, bar charts, and other standard statistical visualizations. This is distinct from Volume Rendering or Surface Extraction because the output is a 2D chart rather than a 3D visual representation of spatial data. It is also distinct from Field Computation because the operation produces a visual artifact (the chart) rather than a new data field.

---

## 15. Scientific Insight Derivation

**Brief:** Interpret visualization or analysis results to answer domain-specific questions.

**Detailed:** This operation covers tasks where the goal is not to produce a particular visual output or labeled data, but to use visualization or analysis to answer a scientific question or derive a domain-relevant conclusion. Examples include determining whether water molecules penetrate a lipid membrane, assessing whether a rendered volume shows a specific anatomical structure, or validating the physical plausibility of simulation results. The defining characteristic is that the output is knowledge or a decision, not a visualization or data artifact. This operation frequently co-occurs with Feature Identification & Segmentation or other operations that provide the analytical basis for the insight.

---

## Mapping from Previous Tags

| Previous Tag | New Tag(s) |
|---|---|
| Spatial/temporal Extraction | Data Subsetting & Extraction |
| Value-Based Selection | Data Subsetting & Extraction |
| Sampling | Data Sampling & Resolution Control |
| Geometric Primitives | Surface & Contour Extraction |
| Volume Representation | Volume Rendering |
| Glyph-Based Representation | Glyph & Marker Placement |
| Color Mapping | Color & Opacity Mapping |
| Geometric Modification | Geometric & Topological Transform |
| Topological Changes | Geometric & Topological Transform |
| Structural Operations | Dataset Restructuring |
| Field Derivatives | Field Computation |
| Scalar Operations | Field Computation |
| Advanced Computations | Field Computation |
| Time-Dependent Processing | Temporal Processing |
| Object identification | Feature Identification & Segmentation |
| Smoothing & enhancement | Data Smoothing & Filtering |
| View / Rendering Manipulation | View & Camera Control |
| Plot Drawing | Plot & Chart Generation |


