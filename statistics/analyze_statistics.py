#!/usr/bin/env python3
"""
Comprehensive Statistics Analysis for SciVisAgentBench
Analyzes all CSV files and generates a detailed statistics report
"""

import pandas as pd
from collections import defaultdict, Counter
import os

# File paths
sheets_dir = "/Users/kuangshiai/Documents/ND-VIS/Code/SciVisAgentBench-tasks/statistics/sheets"
csv_files = [
    "SciVisAgentBench_Statistics - molecular_vis.csv",
    "SciVisAgentBench_Statistics - bioimage_data.csv",
    "SciVisAgentBench_Statistics - sci_volume_data.csv",
    "SciVisAgentBench_Statistics - chatvis_bench.csv",
    "SciVisAgentBench_Statistics - main.csv",
    "SciVisAgentBench_Statistics - topology.csv"
]

def parse_multi_tags(text):
    """Parse semicolon-separated tags and return list"""
    if pd.isna(text) or text.strip() == '':
        return []
    return [tag.strip() for tag in text.split(';') if tag.strip()]

def count_complexity_levels(df):
    """Count operations, tasks, and workflows with Action Count sums"""
    counts = {
        'Operation': 0,
        'Task': 0,
        'Workflow': 0
    }

    operation_sums = {
        'Operation': 0,
        'Task': 0,
        'Workflow': 0
    }

    for _, row in df.iterrows():
        level = row['Task Level 1: Complexity Level']
        if pd.notna(level):
            level = level.strip()
            if level in counts:
                counts[level] += 1

                # Sum Action Counts (skip "N/A")
                if 'Action Count' in row:
                    op_count = row['Action Count']
                    if pd.notna(op_count) and str(op_count).strip() != 'N/A':
                        try:
                            operation_sums[level] += int(op_count)
                        except (ValueError, TypeError):
                            pass

    return counts, operation_sums

def main():
    # Initialize global counters
    all_data = []
    file_stats = {}

    # Read all CSV files
    for csv_file in csv_files:
        file_path = os.path.join(sheets_dir, csv_file)
        df = pd.read_csv(file_path)

        # Remove empty rows
        df = df.dropna(subset=['Case Name'])
        df = df[df['Case Name'].str.strip() != '']

        # Store data
        df['Source File'] = csv_file
        all_data.append(df)

        # Calculate file statistics
        complexity_counts, operation_sums = count_complexity_levels(df)
        file_stats[csv_file] = {
            'total_rows': len(df),
            'operations': complexity_counts['Operation'],
            'tasks': complexity_counts['Task'],
            'workflows': complexity_counts['Workflow'],
            'cases': complexity_counts['Task'] + complexity_counts['Workflow'],
            'operation_sums': operation_sums
        }

    # Combine all data
    all_df = pd.concat(all_data, ignore_index=True)

    # Filter to only cases (Tasks + Workflows, excluding Operations)
    cases_df = all_df[all_df['Task Level 1: Complexity Level'].isin(['Task', 'Workflow'])]

    # 1. TOTAL CASES COUNT
    total_operations = sum(s['operations'] for s in file_stats.values())
    total_tasks = sum(s['tasks'] for s in file_stats.values())
    total_workflows = sum(s['workflows'] for s in file_stats.values())
    total_cases = total_tasks + total_workflows

    # Calculate total Action Counts
    total_op_sum_operations = sum(s['operation_sums']['Operation'] for s in file_stats.values())
    total_op_sum_tasks = sum(s['operation_sums']['Task'] for s in file_stats.values())
    total_op_sum_workflows = sum(s['operation_sums']['Workflow'] for s in file_stats.values())

    # 2. APPLICATION STATISTICS (Cases only: Tasks + Workflows)
    application_counter = Counter()
    for _, row in cases_df.iterrows():
        apps = parse_multi_tags(row['Application'])
        for app in apps:
            application_counter[app] += 1

    # Also count combinations
    application_combinations = Counter()
    for _, row in cases_df.iterrows():
        if pd.notna(row['Application']):
            combo = row['Application'].strip()
            if combo:
                application_combinations[combo] += 1

    # 3. DATA TYPE STATISTICS (Cases only: Tasks + Workflows)
    data_type_counter = Counter()
    for _, row in cases_df.iterrows():
        data_types = parse_multi_tags(row['Data'])
        for dt in data_types:
            data_type_counter[dt] += 1

    # Also count combinations
    data_combinations = Counter()
    for _, row in cases_df.iterrows():
        if pd.notna(row['Data']):
            combo = row['Data'].strip()
            if combo:
                data_combinations[combo] += 1

    # 4. VISUALIZATION OPERATIONS STATISTICS (Cases only: Tasks + Workflows)
    vis_ops_counter = Counter()
    vis_ops_by_level = {
        'Task': Counter(),
        'Workflow': Counter()
    }

    for _, row in cases_df.iterrows():
        ops = parse_multi_tags(row['Task Level 2: Visualization Operations'])
        level = row['Task Level 1: Complexity Level']

        for op in ops:
            vis_ops_counter[op] += 1
            if level in vis_ops_by_level:
                vis_ops_by_level[level][op] += 1

    # Generate markdown report
    report = []
    report.append("# SciVisAgentBench - Comprehensive Statistics Report\n")
    report.append("*Generated from 6 CSV files in the benchmark*\n")
    report.append("---\n")

    # 1. Total Cases Count
    report.append("## 1. Total Cases Count\n")
    report.append("**Important**: Cases = Tasks + Workflows only (Operation-level entries are NOT counted as cases)\n")

    report.append("\n### Overall Summary\n")
    report.append(f"- **Total Operation-level entries**: {total_operations} (NOT counted as cases)\n")
    report.append(f"- **Total Tasks**: {total_tasks}\n")
    report.append(f"- **Total Workflows**: {total_workflows}\n")
    report.append(f"- **Total Cases**: **{total_cases}** (Tasks + Workflows)\n")
    report.append(f"- **Total Actions**: **{total_op_sum_tasks + total_op_sum_workflows}** (sum of Action Count column)\n")

    report.append("\n### Breakdown by File\n")
    report.append("| File | Operation Entries | Tasks | Workflows | Cases (Task+Workflow) |\n")
    report.append("|------|-------------------|-------|-----------|----------------------|\n")

    for csv_file, stats in file_stats.items():
        short_name = csv_file.replace("SciVisAgentBench_Statistics - ", "").replace(".csv", "")
        report.append(f"| {short_name} | {stats['operations']} | {stats['tasks']} | {stats['workflows']} | **{stats['cases']}** |\n")

    report.append(f"| **TOTAL** | **{total_operations}** | **{total_tasks}** | **{total_workflows}** | **{total_cases}** |\n")

    # 2. Application Statistics
    report.append("\n## 2. Application Domain Statistics\n")
    report.append("**Note**: These statistics include ONLY cases (Tasks + Workflows). Operation-level entries are excluded.\n\n")
    report.append("\n### Individual Application Counts\n")
    report.append("*(Counts individual tags, so multi-tagged entries contribute to multiple categories)*\n\n")
    report.append("| Application | Count |\n")
    report.append("|-------------|-------|\n")

    for app, count in sorted(application_counter.items(), key=lambda x: (-x[1], x[0])):
        report.append(f"| {app} | {count} |\n")

    report.append(f"\n**Total individual application tags**: {sum(application_counter.values())}\n")

    report.append("\n### Application Combinations\n")
    report.append("*(Shows exact combinations as they appear in the data)*\n\n")
    report.append("| Application Combination | Count |\n")
    report.append("|------------------------|-------|\n")

    for combo, count in sorted(application_combinations.items(), key=lambda x: (-x[1], x[0])):
        report.append(f"| {combo} | {count} |\n")

    # 3. Data Type Statistics
    report.append("\n## 3. Data Type Statistics\n")
    report.append("**Note**: These statistics include ONLY cases (Tasks + Workflows). Operation-level entries are excluded.\n\n")
    report.append("\n### Individual Data Type Counts\n")
    report.append("*(Counts individual tags, so multi-tagged entries contribute to multiple categories)*\n\n")
    report.append("| Data Type | Count |\n")
    report.append("|-----------|-------|\n")

    for dt, count in sorted(data_type_counter.items(), key=lambda x: (-x[1], x[0])):
        report.append(f"| {dt} | {count} |\n")

    report.append(f"\n**Total individual data type tags**: {sum(data_type_counter.values())}\n")

    report.append("\n### Data Type Combinations\n")
    report.append("*(Shows exact combinations as they appear in the data)*\n\n")
    report.append("| Data Type Combination | Count |\n")
    report.append("|-----------------------|-------|\n")

    for combo, count in sorted(data_combinations.items(), key=lambda x: (-x[1], x[0])):
        report.append(f"| {combo} | {count} |\n")

    # 4. Complexity Level Statistics
    report.append("\n## 4. Task Level 1: Complexity Level Statistics\n")
    report.append("\n### Overall Distribution\n")
    report.append("| Complexity Level | Entry Count | Action Count | Counted as Case? |\n")
    report.append("|------------------|-------------|-----------------|------------------|\n")
    report.append(f"| Operation | {total_operations} | N/A | ❌ NO |\n")
    report.append(f"| Task | {total_tasks} | {total_op_sum_tasks} | ✅ YES |\n")
    report.append(f"| Workflow | {total_workflows} | {total_op_sum_workflows} | ✅ YES |\n")
    report.append(f"| **Total Cases** | **{total_cases}** | **{total_op_sum_tasks + total_op_sum_workflows}** | **(Tasks + Workflows)** |\n")

    # 5. Visualization Operations Statistics
    report.append("\n## 5. Task Level 2: Visualization Operations Statistics\n")
    report.append("**Note**: These statistics include ONLY cases (Tasks + Workflows). Operation-level entries are excluded.\n\n")
    report.append("\n### All Visualization Operations (Sorted by Frequency)\n")
    report.append("| Rank | Visualization Operation | Total Count |\n")
    report.append("|------|------------------------|-------------|\n")

    for i, (op, count) in enumerate(sorted(vis_ops_counter.items(), key=lambda x: (-x[1], x[0])), 1):
        report.append(f"| {i} | {op} | {count} |\n")

    report.append(f"\n**Total visualization operation tags**: {sum(vis_ops_counter.values())}\n")

    # Top operations
    report.append("\n### Top 10 Most Common Visualization Operations\n")
    report.append("| Rank | Operation | Count |\n")
    report.append("|------|-----------|-------|\n")

    top_10 = sorted(vis_ops_counter.items(), key=lambda x: (-x[1], x[0]))[:10]
    for i, (op, count) in enumerate(top_10, 1):
        report.append(f"| {i} | {op} | {count} |\n")

    # Operations by complexity level (Cases only)
    report.append("\n### Visualization Operations by Complexity Level (Cases Only)\n")

    for level in ['Task', 'Workflow']:
        report.append(f"\n#### {level} Level (Top 10)\n")
        report.append("| Rank | Operation | Count |\n")
        report.append("|------|-----------|-------|\n")

        top_ops = sorted(vis_ops_by_level[level].items(), key=lambda x: (-x[1], x[0]))[:10]
        for i, (op, count) in enumerate(top_ops, 1):
            report.append(f"| {i} | {op} | {count} |\n")

    # Complete taxonomy list
    report.append("\n### Complete Taxonomy of 15 Operation Categories\n")
    report.append("\nAll visualization operations found in the benchmark:\n\n")

    all_ops_sorted = sorted(vis_ops_counter.keys())
    for i, op in enumerate(all_ops_sorted, 1):
        count = vis_ops_counter[op]
        report.append(f"{i}. **{op}** ({count} occurrences)\n")

    # Summary statistics
    report.append("\n## 6. Summary Statistics\n")
    report.append(f"- **Total number of CSV files analyzed**: {len(csv_files)}\n")
    report.append(f"- **Total rows in all files**: {len(all_df)}\n")
    report.append(f"- **Total Cases (Tasks + Workflows)**: **{total_cases}**\n")
    report.append(f"- **Unique application domains**: {len(application_counter)}\n")
    report.append(f"- **Unique data types**: {len(data_type_counter)}\n")
    report.append(f"- **Unique visualization operations**: {len(vis_ops_counter)}\n")

    # File breakdown
    report.append("\n### File Contributions\n")
    report.append("| File | Cases Contributed | Percentage |\n")
    report.append("|------|-------------------|------------|\n")

    for csv_file, stats in sorted(file_stats.items(), key=lambda x: -x[1]['cases']):
        short_name = csv_file.replace("SciVisAgentBench_Statistics - ", "").replace(".csv", "")
        percentage = (stats['cases'] / total_cases * 100) if total_cases > 0 else 0
        report.append(f"| {short_name} | {stats['cases']} | {percentage:.1f}% |\n")

    # Write report
    report_content = ''.join(report)
    output_path = "/Users/kuangshiai/Documents/ND-VIS/Code/SciVisAgentBench-tasks/statistics/statistics_report.md"

    with open(output_path, 'w') as f:
        f.write(report_content)

    print(f"Statistics report generated successfully!")
    print(f"Output: {output_path}")
    print(f"\nKey Statistics:")
    print(f"  - Total Cases: {total_cases}")
    print(f"  - Total Tasks: {total_tasks}")
    print(f"  - Total Workflows: {total_workflows}")
    print(f"  - Total Actions: {total_op_sum_tasks + total_op_sum_workflows}")
    print(f"  - Operation-level entries (not counted as cases): {total_operations}")
    print(f"  - Unique Applications: {len(application_counter)}")
    print(f"  - Unique Data Types: {len(data_type_counter)}")
    print(f"  - Unique Visualization Operations: {len(vis_ops_counter)}")

if __name__ == "__main__":
    main()
