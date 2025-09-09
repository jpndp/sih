import os
import json
from typing import Dict, List, Any
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_document_summary(page_texts: Dict[int, Dict], combined_text: str, output_dir: str) -> Dict[str, Any]:
    """
    Create document summary using GitHub models via OpenAI client

    Args:
        page_texts: Dictionary of page texts from OCR
        combined_text: Combined text from all pages
        output_dir: Directory to save summary files

    Returns:
        Dictionary containing summary data or error
    """
    try:
        # Get GitHub token
        token = os.getenv("GITHUB_TOKEN")
        if not token:
            return {
                "error": "GITHUB_TOKEN environment variable not set. Please set your GitHub token."
            }

        # Initialize OpenAI client with GitHub endpoint
        client = OpenAI(
            base_url=os.getenv("GITHUB_MODELS_ENDPOINT", "https://models.github.ai/inference"),
            api_key=token
        )

        # Prepare the content for summarization
        content = f"Document Content:\n{combined_text}\n\nPlease provide a comprehensive summary of this document."

        # Create the chat completion request
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant specialized in document analysis and summarization. Provide structured summaries with key information extraction."
                },
                {
                    "role": "user",
                    "content": content
                }
            ],
            model=os.getenv("GITHUB_MODELS_MODEL", "openai/gpt-4o"),
            max_tokens=2000,
            temperature=0.3
        )

        summary_text = response.choices[0].message.content or ""

        # Extract document type and key information
        document_type = detect_document_type(combined_text)
        key_information = extract_key_information(summary_text)

        # Prepare metadata
        languages = []
        for page_info in page_texts.values():
            if page_info.get('language') and page_info['language'] not in languages:
                languages.append(page_info['language'])

        metadata = {
            "total_pages": len(page_texts),
            "total_characters": len(combined_text),
            "languages_detected": languages
        }

        # Save summary files
        summary_data = {
            "document_type": document_type,
            "overall_summary": summary_text,
            "key_information": key_information,
            "metadata": metadata
        }

        # Save JSON summary
        json_path = os.path.join(output_dir, "document_summary.json")
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(summary_data, f, indent=2, ensure_ascii=False)

        # Save text summary
        txt_path = os.path.join(output_dir, "document_summary.txt")
        txt_content = f"Document Type: {document_type}\n\n"
        txt_content += f"Overall Summary:\n{summary_text}\n\n"
        txt_content += "Key Information:\n"
        for category, items in key_information.items():
            if items:
                txt_content += f"{category.replace('_', ' ').upper()}: {', '.join(items)}\n"
        txt_content += "\nMetadata:\n"
        txt_content += f"Total Pages: {metadata['total_pages']}\n"
        txt_content += f"Total Characters: {metadata['total_characters']}\n"
        txt_content += f"Languages Detected: {', '.join(metadata['languages_detected'])}\n"

        with open(txt_path, 'w', encoding='utf-8') as f:
            f.write(txt_content)

        return summary_data

    except Exception as error:
        print(f"Error in create_document_summary: {error}")
        return {
            "error": f"Failed to generate summary: {str(error)}"
        }

def detect_document_type(text: str) -> str:
    """
    Detect the type of document based on content

    Args:
        text: Document text

    Returns:
        Document type string
    """
    lower_text = text.lower()

    if any(keyword in lower_text for keyword in ["resume", "cv", "experience", "skills"]):
        return "Resume/CV"
    elif any(keyword in lower_text for keyword in ["invoice", "bill", "payment"]):
        return "Invoice"
    elif any(keyword in lower_text for keyword in ["contract", "agreement", "terms"]):
        return "Contract"
    elif "report" in lower_text:
        return "Report"
    else:
        return "Document"

def extract_key_information(summary_text: str) -> Dict[str, List[str]]:
    """
    Extract key information from summary text using pattern matching

    Args:
        summary_text: The summary text to analyze

    Returns:
        Dictionary of key information categories
    """
    import re

    key_info = {
        "names": [],
        "dates": [],
        "organizations": [],
        "locations": [],
        "contact_info": []
    }

    # Basic pattern matching
    name_pattern = r'\b[A-Z][a-z]+ [A-Z][a-z]+\b'
    date_pattern = r'\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b'
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    phone_pattern = r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'

    names = re.findall(name_pattern, summary_text) or []
    dates = re.findall(date_pattern, summary_text) or []
    emails = re.findall(email_pattern, summary_text) or []
    phones = re.findall(phone_pattern, summary_text) or []

    key_info["names"] = list(set(names))
    key_info["dates"] = list(set(dates))
    key_info["contact_info"] = list(set(emails + phones))

    return key_info
