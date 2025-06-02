import pymupdf4llm
import pathlib

# 定义输入 PDF 文件和输出 Markdown 文件的路径
pdf_path = "Multiwfn_3.8_dev.pdf"
markdown_path = "Multiwfn_3.8_dev.md"

print(f"开始转换 PDF 文件: {pdf_path}")
print("正在处理中，请稍候...")

# 将 PDF 转换为 Markdown 文本
md_text = pymupdf4llm.to_markdown(pdf_path)

print("转换完成，正在保存文件...")

# 将 Markdown 文本写入文件，使用 UTF-8 编码
pathlib.Path(markdown_path).write_bytes(md_text.encode("utf-8"))

print(f"成功将 '{pdf_path}' 转换为 '{markdown_path}'")
print(f"输出文件大小: {len(md_text)} 字符")