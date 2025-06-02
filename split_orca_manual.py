#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ORCA手册拆分工具
将大的markdown文件按章节拆分为多个小文件
"""

import re
import os
from pathlib import Path

def split_orca_manual(input_file, output_dir="orca_manual_chapters"):
    """
    拆分ORCA手册为多个章节文件
    
    Args:
        input_file: 输入的markdown文件路径
        output_dir: 输出目录
    """
    
    # 创建输出目录
    Path(output_dir).mkdir(exist_ok=True)
    
    # 读取文件内容
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 定义章节分割模式
    chapter_patterns = [
        # 主标题
        (r'^# \*\*ORCA Manual\*\*', '00_title'),
        
        # 前言部分
        (r'^### \*\*PREFACE\*\*', '01_preface'),
        (r'^### \*\*ORCA 6\.0 FOREWORD\*\*', '02_foreword'),
        (r'^### \*\*ORCA 6 CHANGES\*\*', '03_changes'),
        (r'^### \*\*FAQ – FREQUENTLY ASKED QUESTIONS\*\*', '04_faq'),
        
        # 主要章节 - 使用更精确的模式
        (r'^### \*\*ONE\*\* \*\*GENERAL INFORMATION\*\*', '05_chapter_1_general_info'),
        (r'^### \*\*TWO\*\* \*\*THE ARCHITECTURE OF ORCA\*\*', '06_chapter_2_architecture'),
        (r'^### \*\*THREE\*\* \*\*CALLING THE PROGRAM', '07_chapter_3_calling_program'),
        (r'^### \*\*FOUR\*\* \*\*GENERAL STRUCTURE OF THE INPUT FILE\*\*', '08_chapter_4_input_structure'),
        (r'^### \*\*FIVE\*\* \*\*INPUT OF COORDINATES\*\*', '09_chapter_5_coordinates'),
        (r'^### \*\*SIX\*\* \*\*RUNNING TYPICAL CALCULATIONS\*\*', '10_chapter_6_calculations'),
        (r'^### \*\*SEVEN\*\* \*\*DETAILED DOCUMENTATION\*\*', '11_chapter_7_detailed_docs'),
        (r'^### \*\*EIGHT\*\* \*\*SOME TIPS AND TRICKS\*\*', '12_chapter_8_tips_tricks'),
        
        # 附录
        (r'^### \*\*A\*\* \*\*DETAILED CHANGE LOG\*\*', '13_appendix_a_changelog'),
        (r'^### \*\*B\*\* \*\*PUBLICATIONS RELATED TO ORCA\*\*', '14_appendix_b_publications'),
        (r'^### \*\*C\*\* \*\*BIBLIOGRAPHY\*\*', '15_appendix_c_bibliography'),
    ]
    
    # 找到所有章节分割点
    split_points = []
    lines = content.split('\n')
    
    for i, line in enumerate(lines):
        for pattern, name in chapter_patterns:
            if re.match(pattern, line.strip()):
                split_points.append((i, name, line.strip()))
                print(f"找到章节: {name} 在第 {i+1} 行: {line.strip()}")
                break
    
    # 如果没有找到分割点，尝试更宽松的模式
    if len(split_points) < 5:
        print("使用更宽松的章节检测模式...")
        split_points = []
        
        # 更宽松的模式
        loose_patterns = [
            (r'^# \*\*ORCA Manual\*\*', '00_title'),
            (r'^### \*\*PREFACE\*\*', '01_preface'),
            (r'^### \*\*ORCA 6\.0 FOREWORD\*\*', '02_foreword'),
            (r'^### \*\*ORCA 6 CHANGES\*\*', '03_changes'),
            (r'^### \*\*FAQ', '04_faq'),
            (r'^### \*\*ONE\*\*', '05_chapter_1'),
            (r'^### \*\*TWO\*\*', '06_chapter_2'),
            (r'^### \*\*THREE\*\*', '07_chapter_3'),
            (r'^### \*\*FOUR\*\*', '08_chapter_4'),
            (r'^### \*\*FIVE\*\*', '09_chapter_5'),
            (r'^### \*\*SIX\*\*', '10_chapter_6'),
            (r'^### \*\*SEVEN\*\*', '11_chapter_7'),
            (r'^### \*\*EIGHT\*\*', '12_chapter_8'),
            (r'^### \*\*A\*\*', '13_appendix_a'),
            (r'^### \*\*B\*\*', '14_appendix_b'),
            (r'^### \*\*C\*\*', '15_appendix_c'),
        ]
        
        for i, line in enumerate(lines):
            for pattern, name in loose_patterns:
                if re.match(pattern, line.strip()):
                    split_points.append((i, name, line.strip()))
                    print(f"找到章节: {name} 在第 {i+1} 行: {line.strip()}")
                    break
    
    # 添加文件结束点
    split_points.append((len(lines), 'end', ''))
    
    print(f"\n总共找到 {len(split_points)-1} 个章节")
    
    # 拆分文件
    for i in range(len(split_points) - 1):
        start_line = split_points[i][0]
        end_line = split_points[i + 1][0]
        chapter_name = split_points[i][1]
        
        # 提取章节内容
        chapter_lines = lines[start_line:end_line]
        chapter_content = '\n'.join(chapter_lines)
        
        # 生成文件名
        filename = f"{chapter_name}.md"
        filepath = os.path.join(output_dir, filename)
        
        # 写入文件
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(chapter_content)
        
        print(f"已创建: {filepath} ({len(chapter_lines)} 行)")
    
    print(f"\n拆分完成！所有文件已保存到 '{output_dir}' 目录")
    
    # 创建索引文件
    create_index_file(output_dir, split_points[:-1])

def create_index_file(output_dir, chapters):
    """创建章节索引文件"""
    index_content = "# ORCA Manual 6.0.1 - 章节索引\n\n"
    index_content += "本手册已按章节拆分为以下文件：\n\n"
    
    for i, (line_num, name, title) in enumerate(chapters):
        filename = f"{name}.md"
        # 清理标题中的markdown格式
        clean_title = re.sub(r'\*\*', '', title)
        clean_title = re.sub(r'###\s*', '', clean_title)
        index_content += f"{i+1}. [{clean_title}]({filename})\n"
    
    index_path = os.path.join(output_dir, "README.md")
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(index_content)
    
    print(f"已创建索引文件: {index_path}")

def main():
    """主函数"""
    input_file = "orca_manual_6_0_1.md"
    
    if not os.path.exists(input_file):
        print(f"错误: 找不到输入文件 '{input_file}'")
        return
    
    print(f"开始拆分文件: {input_file}")
    split_orca_manual(input_file)

if __name__ == "__main__":
    main()