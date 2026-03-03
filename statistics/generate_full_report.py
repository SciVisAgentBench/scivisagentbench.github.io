#!/usr/bin/env python3
"""
Generate comprehensive statistics report for SciVisAgentBench.
Processes all CSV files and creates updated statistics.
"""

import pandas as pd
import os
from collections import defaultdict

def load_csv_files(sheets_dir):
    """Load all CSV files from the sheets directory."""
    csv_files = {}

    # Define which files to include (excluding old chatvis_bench and main)
    files_to_include = [
        'SciVisAgentBench_Statistics - bioimage_data.csv',
        'SciVisAgentBench_Statistics - molecular_vis.csv',
        'SciVisAgentBench_Statistics - sci_volume_data.csv',
        'SciVisAgentBench_Statistics - topology.csv',
        'SciVisAgentBench_Statistics - paraview.csv'  # New file
    ]

    for filename in files_to_include:
        filepath = os.path.join(sheets_dir, filename)
        if os.path.exists(filepath):
            df = pd.read_csv(filepath)
            # Extract key from filename
            key = filename.replace('SciVisAgentBench_Statistics - ', '').replace('.csv', '')
            csv_files[key] = df
            print(f"Loaded {filename}: {len(df)} rows")

    return csv_files


def count_individual_tags(series, separator=';'):
    """Count individual tags in a series of semicolon-separated values."""
    counts = defaultdict(int)
    for value in series.dropna():
        if pd.isna(value) or str(value).strip() == '':
            continue
        # Support both ; and , as separators
        value_str = str(value).replace(',', ';')
        tags = [tag.strip() for tag in value_str.split(separator)]
        for tag in tags:
            if tag:
                counts[tag] += 1
    return dict(sorted(counts.items(), key=lambda x: -x[1]))

def count_combinations(series):
    """Count exact combinations as they appear."""
    counts = defaultdict(int)
    for value in series.dropna():
        if pd.isna(value) or str(value).strip() == '':
            continue
        counts[str(value).strip()] += 1
    return dict(sorted(counts.items(), key=lambda x: -x[1]))

def generate_report(csv_files):
    """Generate comprehensive statistics report."""

    # Combine all dataframes
    all_data = pd.concat(csv_files.values(), ignore_index=True)

    # Filter only Task and Workflow levels (exclude Operation level)
    cases_only = all_data[all_data['Task Level 1: Complexity Level'].isin(['Task', 'Workflow'])]

    print(f"\nTotal rows in all files: {len(all_data)}")
    print(f"Total cases (Task + Workflow): {len(cases_only)}")

    # Generate statistics
    stats = {}

    # 1. Total Cases Count
    complexity_counts = all_data['Task Level 1: Complexity Level'].value_counts()
    stats['total_cases'] = len(cases_only)
    stats['total_tasks'] = complexity_counts.get('Task', 0)
    stats['total_workflows'] = complexity_counts.get('Workflow', 0)
    stats['total_operations'] = complexity_counts.get('Operation', 0)

    # File breakdown
    stats['file_breakdown'] = {}
    for name, df in csv_files.items():
        # Calculate total operation count
        cases_df = df[df['Task Level 1: Complexity Level'].isin(['Task', 'Workflow'])]

        # Convert Operation Count to numeric, treating 'N/A' as NaN
        operation_counts = pd.to_numeric(cases_df['Operation Count'], errors='coerce')
        total_operations = operation_counts.sum() if len(operation_counts) > 0 else 0

        file_stats = {
            'total_rows': len(df),
            'operations': len(df[df['Task Level 1: Complexity Level'] == 'Operation']),
            'tasks': len(df[df['Task Level 1: Complexity Level'] == 'Task']),
            'workflows': len(df[df['Task Level 1: Complexity Level'] == 'Workflow']),
            'cases': len(cases_df),
            'total_operations': int(total_operations)
        }
        stats['file_breakdown'][name] = file_stats

    # 2. Application Domain Statistics (cases only)
    stats['applications_individual'] = count_individual_tags(cases_only['Application'])
    stats['applications_combinations'] = count_combinations(cases_only['Application'])

    # 3. Data Type Statistics (cases only)
    stats['data_types_individual'] = count_individual_tags(cases_only['Data'])
    stats['data_types_combinations'] = count_combinations(cases_only['Data'])

    # 4. Visualization Operations Statistics (cases only)
    stats['operations_all'] = count_individual_tags(cases_only['Task Level 2: Visualization Operations'], separator=';')

    # Operations by complexity level
    tasks_only = cases_only[cases_only['Task Level 1: Complexity Level'] == 'Task']
    workflows_only = cases_only[cases_only['Task Level 1: Complexity Level'] == 'Workflow']

    stats['operations_task_level'] = count_individual_tags(tasks_only['Task Level 2: Visualization Operations'], separator=';')
    stats['operations_workflow_level'] = count_individual_tags(workflows_only['Task Level 2: Visualization Operations'], separator=';')

    # Also count operation combinations
    stats['operations_combinations'] = count_combinations(cases_only['Task Level 2: Visualization Operations'])

    return stats, cases_only, all_data

def write_markdown_report(stats, output_path):
    """Write statistics report to markdown file."""

    with open(output_path, 'w') as f:
        f.write("# SciVisAgentBench - Comprehensive Statistics Report\n")
        f.write(f"*Generated from {len(stats['file_breakdown'])} CSV files in the benchmark*\n")
        f.write("---\n")

        # 1. Total Cases Count
        f.write("## 1. Total Cases Count\n")
        f.write("**Important**: Cases = Tasks + Workflows only (Operation-level entries are NOT counted as cases)\n\n")

        f.write("### Overall Summary\n")
        f.write(f"- **Total Tasks**: {stats['total_tasks']}\n")
        f.write(f"- **Total Workflows**: {stats['total_workflows']}\n")
        f.write(f"- **Total Cases**: **{stats['total_cases']}** (Tasks + Workflows)\n")
        if stats['total_operations'] > 0:
            f.write(f"- **Total Operations**: **{stats['total_operations']}** (Operation-level entries)\n")
        f.write("\n")

        f.write("### Breakdown by File\n")
        f.write("| File | Tasks | Workflows | Cases (Task+Workflow) | Total Operations |\n")
        f.write("|------|-------|-----------|----------------------|-----------------|\n")
        total_tasks = 0
        total_workflows = 0
        total_cases = 0
        total_operations_sum = 0
        for name, file_stats in stats['file_breakdown'].items():
            f.write(f"| {name} | {file_stats['tasks']} | {file_stats['workflows']} | "
                   f"**{file_stats['cases']}** | {file_stats['total_operations']} |\n")
            total_tasks += file_stats['tasks']
            total_workflows += file_stats['workflows']
            total_cases += file_stats['cases']
            total_operations_sum += file_stats['total_operations']

        f.write(f"| **TOTAL** | **{total_tasks}** | **{total_workflows}** | **{total_cases}** | **{total_operations_sum}** |\n")
        f.write("\n")

        # 2. Application Domain Statistics
        f.write("## 2. Application Domain Statistics\n")
        f.write("**Note**: These statistics include ONLY cases (Tasks + Workflows). Operation-level entries are excluded.\n\n")

        f.write("### Individual Application Counts\n")
        f.write("*(Counts individual tags, so multi-tagged entries contribute to multiple categories)*\n\n")
        f.write("| Application | Count |\n")
        f.write("|-------------|-------|\n")
        for app, count in stats['applications_individual'].items():
            f.write(f"| {app} | {count} |\n")
        total_app_tags = sum(stats['applications_individual'].values())
        f.write(f"\n**Total individual application tags**: {total_app_tags}\n\n")

        f.write("### Application Combinations\n")
        f.write("*(Shows exact combinations as they appear in the data)*\n\n")
        f.write("| Application Combination | Count |\n")
        f.write("|------------------------|-------|\n")
        for combo, count in stats['applications_combinations'].items():
            f.write(f"| {combo} | {count} |\n")
        f.write("\n")

        # 3. Data Type Statistics
        f.write("## 3. Data Type Statistics\n")
        f.write("**Note**: These statistics include ONLY cases (Tasks + Workflows). Operation-level entries are excluded.\n\n")

        f.write("### Individual Data Type Counts\n")
        f.write("*(Counts individual tags, so multi-tagged entries contribute to multiple categories)*\n\n")
        f.write("| Data Type | Count |\n")
        f.write("|-----------|-------|\n")
        for dtype, count in stats['data_types_individual'].items():
            f.write(f"| {dtype} | {count} |\n")
        total_dtype_tags = sum(stats['data_types_individual'].values())
        f.write(f"\n**Total individual data type tags**: {total_dtype_tags}\n\n")

        f.write("### Data Type Combinations\n")
        f.write("*(Shows exact combinations as they appear in the data)*\n\n")
        f.write("| Data Type Combination | Count |\n")
        f.write("|-----------------------|-------|\n")
        for combo, count in stats['data_types_combinations'].items():
            f.write(f"| {combo} | {count} |\n")
        f.write("\n")

        # 4. Complexity Level Statistics
        f.write("## 4. Task Level 1: Complexity Level Statistics\n\n")
        f.write("### Overall Distribution\n")
        f.write("| Complexity Level | Entry Count | Counted as Case? |\n")
        f.write("|------------------|-------------|------------------|\n")
        if stats['total_operations'] > 0:
            f.write(f"| Operation | {stats['total_operations']} | ❌ NO |\n")
        f.write(f"| Task | {stats['total_tasks']} | ✅ YES |\n")
        f.write(f"| Workflow | {stats['total_workflows']} | ✅ YES |\n")
        f.write(f"| **Total Cases** | **{stats['total_cases']}** | **(Tasks + Workflows)** |\n")
        f.write("\n")

        # 5. Visualization Operations Statistics
        f.write("## 5. Task Level 2: Visualization Operations Statistics\n")
        f.write("**Note**: These statistics include ONLY cases (Tasks + Workflows). Operation-level entries are excluded.\n\n")

        f.write("### All Visualization Operations (Sorted by Frequency)\n")
        f.write("| Rank | Visualization Operation | Total Count |\n")
        f.write("|------|------------------------|-------------|\n")
        for i, (op, count) in enumerate(stats['operations_all'].items(), 1):
            f.write(f"| {i} | {op} | {count} |\n")
        total_op_tags = sum(stats['operations_all'].values())
        f.write(f"\n**Total visualization operation tags**: {total_op_tags}\n\n")

        f.write("### Top 10 Most Common Visualization Operations\n")
        f.write("| Rank | Operation | Count |\n")
        f.write("|------|-----------|-------|\n")
        for i, (op, count) in enumerate(list(stats['operations_all'].items())[:10], 1):
            f.write(f"| {i} | {op} | {count} |\n")
        f.write("\n")

        f.write("### Visualization Operations by Complexity Level (Cases Only)\n\n")

        f.write("#### Task Level (Top 10)\n")
        f.write("| Rank | Operation | Count |\n")
        f.write("|------|-----------|-------|\n")
        for i, (op, count) in enumerate(list(stats['operations_task_level'].items())[:10], 1):
            f.write(f"| {i} | {op} | {count} |\n")
        f.write("\n")

        f.write("#### Workflow Level (Top 10)\n")
        f.write("| Rank | Operation | Count |\n")
        f.write("|------|-----------|-------|\n")
        for i, (op, count) in enumerate(list(stats['operations_workflow_level'].items())[:10], 1):
            f.write(f"| {i} | {op} | {count} |\n")
        f.write("\n")

        # 6. Summary Statistics
        f.write("## 6. Summary Statistics\n")
        f.write(f"- **Total number of CSV files analyzed**: {len(stats['file_breakdown'])}\n")
        f.write(f"- **Total Cases (Tasks + Workflows)**: **{stats['total_cases']}**\n")
        f.write(f"- **Unique application domains**: {len(stats['applications_individual'])}\n")
        f.write(f"- **Unique data types**: {len(stats['data_types_individual'])}\n")
        f.write(f"- **Unique visualization operations**: {len(stats['operations_all'])}\n\n")

        f.write("### File Contributions\n")
        f.write("| File | Cases Contributed | Percentage |\n")
        f.write("|------|-------------------|------------|\n")
        for name, file_stats in sorted(stats['file_breakdown'].items(),
                                      key=lambda x: -x[1]['cases']):
            percentage = (file_stats['cases'] / stats['total_cases'] * 100) if stats['total_cases'] > 0 else 0
            f.write(f"| {name} | {file_stats['cases']} | {percentage:.1f}% |\n")
        f.write("\n")

def main():
    # Paths
    sheets_dir = '/Users/kuangshiai/Documents/ND-VIS/Code/SciVisAgentBench-tasks/statistics/sheets'
    output_path = '/Users/kuangshiai/Documents/ND-VIS/Code/SciVisAgentBench-tasks/statistics/statistics_report.md'

    # Load CSV files
    print("Loading CSV files...")
    csv_files = load_csv_files(sheets_dir)

    # Generate statistics
    print("\nGenerating statistics...")
    stats, cases_only, all_data = generate_report(csv_files)

    # Write markdown report
    print(f"\nWriting report to {output_path}...")
    write_markdown_report(stats, output_path)

    print("\n✅ Report generation complete!")
    print(f"   Total cases: {stats['total_cases']}")
    print(f"   Total files: {len(csv_files)}")

if __name__ == '__main__':
    main()
