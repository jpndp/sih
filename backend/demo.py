import os
import json
from ocr import extract_document_text
import load_env  # Load environment variables from .env file

def demo_llm_summarization():
    """
    Demo of the complete OCR + LLM summarization pipeline
    """
    print("🚀 Document Intelligence System Demo")
    print("=" * 50)

    # Set up paths
    pdf_path = os.path.join(os.getcwd(), "IshpreetResume.pdf")
    output_dir = os.path.join(os.getcwd(), "output")

    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    print(f"📄 Processing: {pdf_path}")
    print(f"📁 Output directory: {output_dir}")

    try:
        # Step 1: OCR Processing
        print("\n🔍 Step 1: Extracting text from PDF...")
        page_texts, combined_text = extract_document_text(
            file_path=pdf_path,
            output_dir=output_dir,
            tesseract_langs='mal+eng'
        )

        print("✅ OCR Complete!")
        print(f"   📊 Pages: {len(page_texts)}")
        print(f"   📝 Characters: {len(combined_text)}")
        print(f"   🌍 Languages: {', '.join(set([info['language'] for info in page_texts.values()]))}")

        # Step 2: Mock LLM Analysis (since GitHub token not configured)
        print("\n🤖 Step 2: AI Analysis (Mock Response)...")

        # Mock LLM responses
        mock_summary = """
        This is a professional resume for Ishpreet Singh, a Full Stack Developer with 1+ years of experience.
        Key highlights include:
        - Experience building React.js applications
        - Created emergency response system reducing response time by 35%
        - Developed AI-powered mental health platform with 92% accuracy
        - Strong technical skills in JavaScript, Go, Java, C++, Python
        - Cloud expertise with AWS services
        - DevOps experience with Docker and Kubernetes
        """

        mock_key_info = {
            "names_titles": ["Ishpreet Singh", "Full Stack Developer", "Frontend Developer Intern"],
            "contacts": ["9811101611", "ishpreet@outlook.in", "linkedin.com/in/ishpreet404", "github.com/ishpreet404"],
            "locations": ["New Delhi, India"],
            "key_terms": ["React.js", "AWS", "Docker", "Kubernetes", "JavaScript", "Python"],
            "dates_periods": ["May 2025 - June 2025"]
        }

        # Step 3: Generate comprehensive report
        print("\n📋 Step 3: Generating Analysis Report...")

        analysis_data = {
            "document_type": "Professional Resume/CV",
            "overall_summary": mock_summary.strip(),
            "key_information": mock_key_info,
            "metadata": {
                "total_pages": len(page_texts),
                "total_characters": len(combined_text),
                "languages_detected": list(set([info['language'] for info in page_texts.values()])),
                "processing_method": "OCR + AI Analysis"
            }
        }

        # Save detailed analysis
        analysis_path = os.path.join(output_dir, "document_analysis.json")
        with open(analysis_path, 'w', encoding='utf-8') as f:
            json.dump(analysis_data, f, indent=2, ensure_ascii=False)

        # Display results
        print("\n" + "="*60)
        print("📊 DOCUMENT ANALYSIS RESULTS")
        print("="*60)

        print(f"\n📋 Document Type: {analysis_data['document_type']}")
        print(f"\n📝 Summary:\n{analysis_data['overall_summary']}")

        print("\n🔑 Key Information:")
        for category, items in analysis_data['key_information'].items():
            if items:
                print(f"  • {category.replace('_', ' ').title()}: {', '.join(items)}")

        print("\n📊 Metadata:")
        print(f"  • Total Pages: {analysis_data['metadata']['total_pages']}")
        print(f"  • Total Characters: {analysis_data['metadata']['total_characters']}")
        print(f"  • Languages Detected: {', '.join(analysis_data['metadata']['languages_detected'])}")

        print("\n💾 Files Generated:")
        print(f"  • {os.path.join(output_dir, 'page_1.txt')} - Extracted text")
        print(f"  • {os.path.join(output_dir, 'page_1_meta.json')} - Page metadata")
        print(f"  • {analysis_path} - Complete analysis")

        print("\n✅ Demo Complete!")
        print("💡 To use real LLM summarization:")
        print("   1. Run: python setup_token.py")
        print("   2. Get GitHub token from: https://github.com/settings/tokens")
        print("   3. Run: python script.py")

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    demo_llm_summarization()
