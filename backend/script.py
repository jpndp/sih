from ocr import extract_document_text
import os

# Set up paths
pdf_path = os.path.join(os.getcwd(), "IshpreetResume.pdf")
output_dir = os.path.join(os.getcwd(), "output")

# Create output directory if it doesn't exist
os.makedirs(output_dir, exist_ok=True)

print(f"PDF path: {pdf_path}")
print(f"Output directory: {output_dir}")
print(f"PDF exists: {os.path.exists(pdf_path)}")

# Extract text from PDF
page_texts, combined_text = extract_document_text(
    file_path=pdf_path,
    output_dir=output_dir,
    tesseract_langs='mal+eng'  # Malayalam + English
)

# Access results
print(f"Extracted {len(page_texts)} pages")
print(f"Combined text length: {len(combined_text)} characters")

# View page 1 text
print(page_texts[1]['marked_text'])

# Check languages detected
for page_num, info in page_texts.items():
    print(f"Page {page_num}: {info['language']} (via {info['method']})")