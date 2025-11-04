# Data Format Specification

This document describes the expected format for dataset submissions to SciVisAgentBench.

## Submission JSON Format

When a dataset is submitted through the website, it's stored in the following JSON format:

```json
{
  "id": "unique-id-12345",
  "timestamp": "2025-01-15T10:30:00.000Z",

  "contributorName": "Dr. Jane Smith",
  "contributorEmail": "jane.smith@university.edu",
  "contributorInstitution": "University of Notre Dame",
  "contributorOrcid": "0000-0000-0000-0000",

  "datasetName": "Brain MRI Volume Rendering",
  "datasetDescription": "High-resolution T1-weighted brain MRI scan for volume rendering tasks",

  "dataSource": "medical",
  "dataSourceOther": "",

  "dataType": ["scalar"],

  "visTask": ["volume", "isosurface"],
  "visTaskOther": "",

  "interaction": ["transfer-function", "viewpoint", "zoom"],

  "complexity": "medium",

  "taskDescription": "Load the brain MRI dataset and create a volume rendering. Adjust the transfer function to show the skull in white (opacity 0.3), gray matter in gray (opacity 0.6), and white matter in light beige (opacity 0.8).",

  "evalCriteria": "1) Overall visualization quality (10 pts)\n2) Correct transfer function with 3 regions (10 pts)\n3) Skull appearance (5 pts)\n4) Gray matter appearance (5 pts)\n5) White matter appearance (5 pts)",

  "useImageMetrics": "true",

  "additionalNotes": "This dataset is from the OASIS-3 collection, properly anonymized.",

  "agreeToTerms": "true",

  "files": {
    "sourceData": "brain_t1.nii.gz",
    "groundTruthImages": ["view_front.png", "view_side.png", "view_top.png"],
    "vizEngineState": "brain_rendering.pvsm",
    "metadataFile": "brain_metadata.json"
  }
}
```

## Field Descriptions

### Contributor Information
- **contributorName** (required): Full name of the contributor
- **contributorEmail** (required): Email for communication and attribution
- **contributorInstitution** (required): Affiliated organization
- **contributorOrcid** (optional): ORCID identifier

### Dataset Metadata
- **datasetName** (required): Short descriptive name
- **datasetDescription** (required): Detailed description of the dataset

### Classification Fields
- **dataSource** (required): One of `medical`, `simulation`, `molecular`, `other`
- **dataSourceOther** (optional): Description if `other` is selected
- **dataType** (required): Array of `scalar`, `vector`, `tensor`
- **visTask** (required): Array of visualization tasks
  - `isosurface`, `volume`, `tda`, `streamlines`, `critical-points`, `glyphs`, `other`
- **visTaskOther** (optional): Description if `other` is selected
- **interaction** (optional): Array of interaction types
  - `zoom`, `clip`, `viewpoint`, `temporal`, `transfer-function`

### Task Information
- **complexity** (required): One of `easy`, `medium`, `hard`
- **taskDescription** (required): Natural language description for LLM agent
- **evalCriteria** (required): Evaluation rubric and scoring
- **useImageMetrics** (optional): Boolean for quantitative image comparison

### Additional
- **additionalNotes** (optional): Any extra information
- **agreeToTerms** (required): Boolean confirming CC BY 4.0 license agreement

## File Formats

### Source Data Files

Supported formats:
- **VTK formats**: `.vtk`, `.vti`, `.vtu`, `.vtp`, `.vtr`
- **Medical imaging**: `.nii`, `.nii.gz`, `.dcm`, `.mhd`, `.nhdr`
- **Raw data**: `.raw` (with accompanying metadata)
- **HDF5**: `.h5`, `.hdf5`

File naming convention: `{dataset-name}_source.{ext}`

### Ground Truth Images

Requirements:
- **Format**: PNG (preferred) or JPEG
- **Resolution**: Minimum 1024x1024 pixels
- **Views**: At least 3 different camera positions
- **Naming**: `{dataset-name}_view_{front|side|top|angle1|angle2}.png`

Example:
```
brain_mri_view_front.png
brain_mri_view_side.png
brain_mri_view_top.png
```

### Visualization Engine State Files

#### ParaView State (.pvsm)
```xml
<ServerManagerState version="5.11.0">
  <!-- Full ParaView state with all filters and settings -->
</ServerManagerState>
```

#### Python Script (.py)
```python
# ParaView Python script
from paraview.simple import *

# Load data
reader = NiftiImageReader(FileName='brain_t1.nii.gz')

# Create volume rendering
vol = Show(reader)
vol.Representation = 'Volume'

# Set transfer function
# ... (complete visualization pipeline)
```

### Metadata File (metadata.json)

```json
{
  "dataset_info": {
    "name": "Brain MRI Volume Rendering",
    "version": "1.0",
    "created_date": "2025-01-15",
    "license": "CC BY 4.0"
  },

  "data_characteristics": {
    "dimensions": [256, 256, 180],
    "spacing": [1.0, 1.0, 1.0],
    "origin": [0.0, 0.0, 0.0],
    "scalar_range": [0, 4095],
    "data_type": "uint16"
  },

  "physical_properties": {
    "domain": "medical imaging",
    "modality": "MRI",
    "sequence": "T1-weighted",
    "units": "intensity values",
    "subject_info": "anonymized adult brain"
  },

  "visualization_parameters": {
    "recommended_isovalue": 1500,
    "transfer_function": {
      "points": [
        {"value": 0, "opacity": 0.0, "color": [0, 0, 0]},
        {"value": 500, "opacity": 0.3, "color": [1, 1, 1]},
        {"value": 1500, "opacity": 0.6, "color": [0.5, 0.5, 0.5]},
        {"value": 3000, "opacity": 0.8, "color": [0.9, 0.9, 0.7]}
      ]
    },
    "camera_positions": {
      "front": {"position": [0, -400, 0], "focal_point": [128, 128, 90], "up": [0, 0, 1]},
      "side": {"position": [400, 0, 0], "focal_point": [128, 128, 90], "up": [0, 0, 1]},
      "top": {"position": [0, 0, 400], "focal_point": [128, 128, 90], "up": [0, 1, 0]}
    }
  },

  "evaluation_config": {
    "image_similarity_threshold": 0.85,
    "ssim_weight": 0.5,
    "lpips_weight": 0.3,
    "psnr_weight": 0.2,
    "manual_criteria": [
      {"name": "Overall Quality", "max_points": 10},
      {"name": "Transfer Function", "max_points": 10},
      {"name": "Skull Appearance", "max_points": 5},
      {"name": "Gray Matter", "max_points": 5},
      {"name": "White Matter", "max_points": 5}
    ]
  },

  "references": {
    "publication": "Smith et al., 2024, Journal of Medical Imaging",
    "doi": "10.1234/jmi.2024.001",
    "original_dataset": "OASIS-3"
  }
}
```

## Converting to Benchmark YAML Format

The submitted JSON should be converted to the YAML format used by the benchmark:

```yaml
# tests/brain_mri_volume.yaml

description: "Brain MRI Volume Rendering Task"

providers:
  - id: paraview-mcp
    config:
      dataset_path: "./data/brain_mri/brain_t1.nii.gz"

prompts:
  - "Load the brain MRI dataset and create a volume rendering. Adjust the transfer function to show the skull in white (opacity 0.3), gray matter in gray (opacity 0.6), and white matter in light beige (opacity 0.8)."

vars:
  dataset_name: "brain_mri"
  complexity: "medium"
  data_type: "scalar"
  vis_task: "volume_rendering"

assert:
  - type: llm-rubric
    value: |
      Evaluate the visualization output on the following criteria:
      1. Overall visualization quality (0-10 points)
      2. Correct transfer function with 3 distinct regions (0-10 points)
      3. Skull appears white with 30% opacity (0-5 points)
      4. Gray matter appears gray with 60% opacity (0-5 points)
      5. White matter appears light beige with 80% opacity (0-5 points)

      Total: 35 points

      Compare the agent output with the ground truth images.

  - type: image-similarity
    value:
      metric: "ssim"
      threshold: 0.85
      ground_truth_paths:
        - "./data/brain_mri/ground_truth/view_front.png"
        - "./data/brain_mri/ground_truth/view_side.png"
        - "./data/brain_mri/ground_truth/view_top.png"

  - type: python
    value: |
      # Custom verification script
      import paraview.simple as pv

      # Check if volume rendering is used
      assert output.Representation == 'Volume', "Must use volume rendering"

      # Verify transfer function has correct number of points
      tf = output.LookupTable
      assert len(tf.RGBPoints) >= 12, "Transfer function must have at least 3 control points"
```

## Directory Structure for Complete Submission

```
submissions/
└── brain_mri_001/
    ├── submission.json          # Main submission metadata
    ├── data/
    │   └── brain_t1.nii.gz     # Source data file
    ├── ground_truth/
    │   ├── view_front.png      # Front view
    │   ├── view_side.png       # Side view
    │   └── view_top.png        # Top view
    ├── state/
    │   ├── brain_rendering.pvsm # ParaView state
    │   └── script.py           # Python script (optional)
    └── metadata.json           # Extended metadata
```

## Validation Rules

Before accepting a submission, validate:

1. **Required fields are present**: All non-optional fields must have values
2. **Email format**: Valid email address for contributor
3. **Data types are valid**: Arrays contain only allowed values
4. **File existence**: Uploaded files are accessible
5. **File formats**: Files match expected formats
6. **Image requirements**: Ground truth images meet minimum resolution
7. **License agreement**: Terms must be accepted

## Example Conversion Script

```python
def convert_submission_to_yaml(submission):
    """Convert website submission to benchmark YAML format"""

    yaml_content = {
        'description': submission['taskDescription'],
        'providers': [{
            'id': 'paraview-mcp',
            'config': {
                'dataset_path': f"./data/{submission['datasetName']}/{submission['files']['sourceData']}"
            }
        }],
        'prompts': [submission['taskDescription']],
        'vars': {
            'dataset_name': submission['datasetName'],
            'complexity': submission['complexity'],
            'data_type': submission['dataType'][0] if submission['dataType'] else 'unknown',
            'vis_task': submission['visTask'][0] if submission['visTask'] else 'unknown'
        },
        'assert': []
    }

    # Add LLM rubric
    yaml_content['assert'].append({
        'type': 'llm-rubric',
        'value': submission['evalCriteria']
    })

    # Add image similarity if requested
    if submission.get('useImageMetrics'):
        yaml_content['assert'].append({
            'type': 'image-similarity',
            'value': {
                'metric': 'ssim',
                'threshold': 0.85,
                'ground_truth_paths': [
                    f"./data/{submission['datasetName']}/ground_truth/{img}"
                    for img in submission['files']['groundTruthImages']
                ]
            }
        })

    return yaml_content
```

## Notes

- All paths should be relative to the benchmark root directory
- File sizes should be reasonable (< 500MB for data files)
- Ground truth images should be compressed but maintain quality
- Metadata files are optional but highly recommended
- ParaView state files should be version 5.x compatible

---

For questions about data formats, please open an issue on GitHub.
