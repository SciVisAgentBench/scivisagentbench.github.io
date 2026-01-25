#!/usr/bin/env python3
"""
SciVisAgentBench Statistics Analysis Script
This script analyzes the final_correct.csv file and generates statistics for the benchmark.
"""

import csv
from collections import defaultdict

# Define the exact taxonomy categories as specified
APPLICATIONS = ['Astronomy', 'Medical Science', 'Biology', 'Physics', 'Earth System Science', 'Mathematics', 'Chemistry', 'Others']

TASK1_CATEGORIES = ['Atomic Operation', 'Workflow', 'Scientific Insights']

TASK2_CATEGORIES = [
    'Geometric Primitives',
    'Volume Representation',
    'Plot Drawing',
    'Spatial/temporal Extraction',
    'Value-Based Selection',
    'Sampling',
    'Geometric Modification',
    'Topological Changes',
    'Structural Operations',
    'Field Derivatives',
    'Scalar Operations',
    'Advanced Computations',
    'Time-Dependent Processing',
    'Glyph-Based Representation',
    'Color Mapping',
    'Smoothing & enhancement',
    'View / Rendering Manipulation',
    'Object identification'
]

DATA_TYPES = ['Scalar Fields', 'Vector Fields', 'Tensor Fields', 'Multi-variate', 'Time-varying']

def normalize_tag(tag):
    """Normalize tag capitalization and spacing."""
    tag = tag.strip()

    # Create a mapping for known variations
    normalizations = {
        'atomic operation': 'Atomic Operation',
        'workflow': 'Workflow',
        'scientific insights': 'Scientific Insights',
        'object identification': 'Object identification',
        'geometric primitives': 'Geometric Primitives',
        'volume representation': 'Volume Representation',
        'plot drawing': 'Plot Drawing',
        'spatial/temporal extraction': 'Spatial/temporal Extraction',
        'value-based selection': 'Value-Based Selection',
        'sampling': 'Sampling',
        'geometric modification': 'Geometric Modification',
        'topological changes': 'Topological Changes',
        'structural operations': 'Structural Operations',
        'field derivatives': 'Field Derivatives',
        'scalar operations': 'Scalar Operations',
        'advanced computations': 'Advanced Computations',
        'time-dependent processing': 'Time-Dependent Processing',
        'glyph-based representation': 'Glyph-Based Representation',
        'color mapping': 'Color Mapping',
        'smoothing & enhancement': 'Smoothing & enhancement',
        'view / rendering manipulation': 'View / Rendering Manipulation',
        'scalar fields': 'Scalar Fields',
        'vector fields': 'Vector Fields',
        'tensor fields': 'Tensor Fields',
        'multi-variate': 'Multi-variate',
        'time-varying': 'Time-varying'
    }

    tag_lower = tag.lower()
    return normalizations.get(tag_lower, tag)

def read_csv_data(filename):
    """Read and parse the CSV file into categories."""
    data = []
    with open(filename, 'r') as f:
        reader = csv.reader(f)
        for row in reader:
            data.append(row)

    # Find category boundaries
    categories = {}
    current_category = None
    for i, row in enumerate(data):
        # Category header: first column has value, rest are empty
        if len(row) >= 1 and row[0] and all(not cell for cell in row[1:]):
            current_category = row[0]
            categories[current_category] = []
        # Data row: has Case Name, Application, Task, Data
        elif len(row) >= 4 and row[0] and row[1] and current_category:
            if row[0] != "Case Name":  # Skip header rows
                categories[current_category].append(row)

    return categories

def count_tags(categories):
    """Count all tags across categories."""
    app_counts = defaultdict(int)
    task1_counts = defaultdict(int)
    task2_counts = defaultdict(int)
    data_counts = defaultdict(int)

    total_cases = 0
    category_stats = {}

    for category, cases in categories.items():
        total_cases += len(cases)

        cat_app = defaultdict(int)
        cat_task1 = defaultdict(int)
        cat_task2 = defaultdict(int)
        cat_data = defaultdict(int)

        for case in cases:
            # Application
            if case[1]:
                apps = [normalize_tag(a) for a in case[1].split(';')]
                for app in apps:
                    if app:
                        app_counts[app] += 1
                        cat_app[app] += 1

            # Task (contains both Task1 and Task2 separated by semicolons)
            if case[2]:
                tasks = [normalize_tag(t) for t in case[2].split(';')]

                for task in tasks:
                    if not task:
                        continue

                    # Determine if it's Task1 or Task2
                    if task in TASK1_CATEGORIES:
                        task1_counts[task] += 1
                        cat_task1[task] += 1
                    elif task in TASK2_CATEGORIES:
                        task2_counts[task] += 1
                        cat_task2[task] += 1

            # Data
            if case[3]:
                data_types = [normalize_tag(d) for d in case[3].split(';')]
                for dtype in data_types:
                    if dtype:
                        data_counts[dtype] += 1
                        cat_data[dtype] += 1

        category_stats[category] = {
            'count': len(cases),
            'applications': dict(cat_app),
            'task1': dict(cat_task1),
            'task2': dict(cat_task2),
            'data': dict(cat_data)
        }

    return {
        'total_cases': total_cases,
        'app_counts': dict(app_counts),
        'task1_counts': dict(task1_counts),
        'task2_counts': dict(task2_counts),
        'data_counts': dict(data_counts),
        'category_stats': category_stats
    }

def print_statistics(stats):
    """Print statistics to console."""
    print(f"\n{'='*60}")
    print(f"OVERALL STATISTICS")
    print(f"{'='*60}")
    print(f"Total number of cases: {stats['total_cases']}")

    # Category breakdown
    print(f"\n{'='*60}")
    print(f"CASES BY CATEGORY")
    print(f"{'='*60}")
    for category, cat_stats in stats['category_stats'].items():
        print(f"{category}: {cat_stats['count']} cases")

    # Application domains
    print(f"\n{'='*60}")
    print(f"APPLICATION DOMAIN COUNTS")
    print(f"{'='*60}")
    for app in APPLICATIONS:
        count = stats['app_counts'].get(app, 0)
        percentage = (count / stats['total_cases']) * 100 if count > 0 else 0
        print(f"{app}: {count} ({percentage:.1f}%)")

    # Task 1
    print(f"\n{'='*60}")
    print(f"TASK LEVEL 1 COUNTS")
    print(f"{'='*60}")
    for task in TASK1_CATEGORIES:
        count = stats['task1_counts'].get(task, 0)
        percentage = (count / stats['total_cases']) * 100 if count > 0 else 0
        print(f"{task}: {count} ({percentage:.1f}%)")

    # Task 2
    print(f"\n{'='*60}")
    print(f"TASK LEVEL 2 COUNTS")
    print(f"{'='*60}")
    for task in TASK2_CATEGORIES:
        count = stats['task2_counts'].get(task, 0)
        print(f"{task}: {count}")

    # Data types
    print(f"\n{'='*60}")
    print(f"DATA TYPE COUNTS")
    print(f"{'='*60}")
    for dtype in DATA_TYPES:
        count = stats['data_counts'].get(dtype, 0)
        print(f"{dtype}: {count}")

def generate_markdown_report(stats, output_file):
    """Generate a markdown report file."""
    with open(output_file, 'w') as f:
        f.write("# SciVisAgentBench Statistics Report\n\n")

        f.write("## Overall Statistics\n\n")
        f.write(f"**Total Cases: {stats['total_cases']}**\n\n")

        # Cases by category
        f.write("## Cases by Category\n\n")
        f.write("| Category | Number of Cases |\n")
        f.write("|----------|----------------|\n")
        for category, cat_stats in stats['category_stats'].items():
            f.write(f"| {category} | {cat_stats['count']} |\n")
        f.write("\n")

        # Application domains
        f.write("## Application Domain Distribution\n\n")
        f.write("| Application Domain | Count | Percentage |\n")
        f.write("|-------------------|-------|------------|\n")
        for app in APPLICATIONS:
            count = stats['app_counts'].get(app, 0)
            percentage = (count / stats['total_cases']) * 100 if count > 0 else 0
            f.write(f"| {app} | {count} | {percentage:.1f}% |\n")
        f.write("\n")

        # Task 1
        f.write("## Task Level 1 Distribution\n\n")
        f.write("| Task Type | Count | Percentage |\n")
        f.write("|-----------|-------|------------|\n")
        for task in TASK1_CATEGORIES:
            count = stats['task1_counts'].get(task, 0)
            percentage = (count / stats['total_cases']) * 100 if count > 0 else 0
            f.write(f"| {task} | {count} | {percentage:.1f}% |\n")
        f.write("\n")
        f.write("*Note: Some cases have multiple Task 1 tags*\n\n")

        # Task 2
        f.write("## Task Level 2 Distribution (Visualization Operations)\n\n")
        f.write("| Operation Type | Count |\n")
        f.write("|----------------|-------|\n")
        for task in TASK2_CATEGORIES:
            count = stats['task2_counts'].get(task, 0)
            f.write(f"| {task} | {count} |\n")
        f.write("\n")

        # Data types
        f.write("## Data Type Distribution\n\n")
        f.write("| Data Type | Count |\n")
        f.write("|-----------|-------|\n")
        for dtype in DATA_TYPES:
            count = stats['data_counts'].get(dtype, 0)
            f.write(f"| {dtype} | {count} |\n")
        f.write("\n")
        f.write("*Note: Cases can have multiple data type tags*\n\n")

        # Detailed category breakdown
        f.write("## Detailed Category Breakdown\n\n")
        for category, cat_stats in stats['category_stats'].items():
            f.write(f"### {category}\n\n")
            f.write(f"**Total Cases:** {cat_stats['count']}\n\n")

            if cat_stats['applications']:
                f.write("**Applications:**\n")
                for app in APPLICATIONS:
                    count = cat_stats['applications'].get(app, 0)
                    if count > 0:
                        f.write(f"- {app}: {count}\n")
                f.write("\n")

            if cat_stats['task1']:
                f.write("**Task Level 1:**\n")
                for task in TASK1_CATEGORIES:
                    count = cat_stats['task1'].get(task, 0)
                    if count > 0:
                        f.write(f"- {task}: {count}\n")
                f.write("\n")

            if cat_stats['task2']:
                f.write("**Task Level 2:**\n")
                for task in TASK2_CATEGORIES:
                    count = cat_stats['task2'].get(task, 0)
                    if count > 0:
                        f.write(f"- {task}: {count}\n")
                f.write("\n")

            if cat_stats['data']:
                f.write("**Data Types:**\n")
                for dtype in DATA_TYPES:
                    count = cat_stats['data'].get(dtype, 0)
                    if count > 0:
                        f.write(f"- {dtype}: {count}\n")
                f.write("\n")

        # Key insights
        f.write("## Key Insights\n\n")

        # Top application
        top_app = max(((app, stats['app_counts'].get(app, 0)) for app in APPLICATIONS), key=lambda x: x[1])
        if top_app[1] > 0:
            f.write(f"1. **Most Common Application Domain**: {top_app[0]} ({top_app[1]} cases, {top_app[1]/stats['total_cases']*100:.1f}%)\\n\n")

        # Top task1
        top_task1 = max(((task, stats['task1_counts'].get(task, 0)) for task in TASK1_CATEGORIES), key=lambda x: x[1])
        if top_task1[1] > 0:
            f.write(f"2. **Most Common Task Level 1**: {top_task1[0]} ({top_task1[1]} cases, {top_task1[1]/stats['total_cases']*100:.1f}%)\\n\n")

        # Top task2
        top_task2 = max(((task, stats['task2_counts'].get(task, 0)) for task in TASK2_CATEGORIES), key=lambda x: x[1])
        if top_task2[1] > 0:
            f.write(f"3. **Most Common Task Level 2 Operation**: {top_task2[0]} ({top_task2[1]} occurrences)\\n\n")

        # Top data type
        top_data = max(((dtype, stats['data_counts'].get(dtype, 0)) for dtype in DATA_TYPES), key=lambda x: x[1])
        if top_data[1] > 0:
            f.write(f"4. **Most Common Data Type**: {top_data[0]} ({top_data[1]} occurrences)\\n\n")

        # Coverage
        bio_chem = stats['app_counts'].get('Biology', 0) + stats['app_counts'].get('Chemistry', 0)
        f.write(f"5. **Biology and Chemistry Coverage**: {bio_chem} cases ({bio_chem/stats['total_cases']*100:.1f}% of total)\\n\\n")

if __name__ == "__main__":
    # Read data
    print("Reading final_correct.csv...")
    categories = read_csv_data('final_correct.csv')

    # Calculate statistics
    print("Calculating statistics...")
    stats = count_tags(categories)

    # Print to console
    print_statistics(stats)

    # Generate markdown report
    print("\nGenerating markdown report...")
    generate_markdown_report(stats, 'statistics_report.md')
    print("Report saved to statistics_report.md")
