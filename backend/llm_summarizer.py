import os
import json
import requests
from typing import Dict, List, Optional
import logging
import load_env  # Load environment variables from .env file

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GitHubLLMDocumentSummarizer:
    def __init__(self, github_token: Optional[str] = None, model: str = None, endpoint: str = None):
        """
        Initialize GitHub LLM summarizer with fallback to OpenAI

        Args:
            github_token: GitHub token for API access
            model: Model to use for summarization
            endpoint: GitHub Models API endpoint
        """
        self.github_token = github_token or os.getenv('GITHUB_TOKEN')
        self.openai_key = os.getenv('OPENAI_API_KEY')
        self.model = model or os.getenv('GITHUB_MODELS_MODEL', 'openai/gpt-4o')
        self.endpoint = endpoint or os.getenv('GITHUB_MODELS_ENDPOINT', 'https://models.github.ai/inference')

        # Determine which API to use
        if self.openai_key:
            self.api_provider = "openai"
            logger.info("Using OpenAI API for summarization")
        elif self.github_token:
            self.api_provider = "github"
            logger.info("Using GitHub Models API for summarization")
        else:
            self.api_provider = None
            logger.warning("No API keys found. Set GITHUB_TOKEN or OPENAI_API_KEY environment variable.")

    def summarize_document(self, combined_text: str, max_length: int = 500) -> str:
        """
        Summarize the entire document

        Args:
            combined_text: Combined text from all pages
            max_length: Maximum length of summary in words

        Returns:
            Document summary
        """
        prompt = f"""
        Please provide a comprehensive summary of the following document. Focus on:
        1. Main topics and key information
        2. Important details and facts
        3. Structure and organization of content
        4. Any actionable items or conclusions

        Document text:
        {combined_text[:4000]}  # Limit input to avoid token limits

        Summary (keep under {max_length} words):
        """

        return self._call_github_llm(prompt)

    def summarize_page(self, page_text: str, page_num: int) -> str:
        """
        Summarize a single page

        Args:
            page_text: Text content of the page
            page_num: Page number

        Returns:
            Page summary
        """
        prompt = f"""
        Summarize the content of page {page_num} from a document. Include:
        1. Main topics covered
        2. Key information and details
        3. Any important data or facts

        Page {page_num} text:
        {page_text[:2000]}  # Limit input

        Summary:
        """

        return self._call_github_llm(prompt)

    def extract_key_information(self, combined_text: str) -> Dict[str, List[str]]:
        """
        Extract key information from the document

        Args:
            combined_text: Combined text from all pages

        Returns:
            Dictionary with different types of key information
        """
        prompt = f"""
        Extract key information from the following document. Categorize into:
        1. Names and titles
        2. Dates and time periods
        3. Locations and addresses
        4. Contact information
        5. Important numbers and statistics
        6. Key terms and concepts

        Document text:
        {combined_text[:3000]}

        Return as JSON format:
        {{
            "names_titles": ["list of names and titles"],
            "dates_periods": ["list of dates and periods"],
            "locations": ["list of locations"],
            "contacts": ["list of contact info"],
            "numbers_stats": ["list of important numbers"],
            "key_terms": ["list of key terms"]
        }}
        """

        response = self._call_github_llm(prompt)

        try:
            return json.loads(response)
        except json.JSONDecodeError:
            logger.warning("Failed to parse LLM response as JSON, returning empty dict")
            return {
                "names_titles": [],
                "dates_periods": [],
                "locations": [],
                "contacts": [],
                "numbers_stats": [],
                "key_terms": []
            }

    def detect_document_type(self, combined_text: str) -> str:
        """
        Detect the type of document

        Args:
            combined_text: Combined text from all pages

        Returns:
            Document type classification
        """
        prompt = f"""
        Analyze the following text and determine what type of document this is.
        Common document types: resume/CV, invoice, contract, report, letter, form, article, manual, etc.

        Document text:
        {combined_text[:1000]}

        Document type:
        """

        return self._call_github_llm(prompt).strip()

    def _call_github_llm(self, prompt: str) -> str:
        """
        Call LLM API (GitHub Models or OpenAI as fallback)

        Args:
            prompt: Prompt to send to the model

        Returns:
            LLM response
        """
        if not self.api_provider:
            return "Error: No API keys configured. Please set GITHUB_TOKEN or OPENAI_API_KEY environment variable."

        # Try GitHub Models API first if available
        if self.api_provider == "github" and self.github_token:
            response = self._call_github_models_api(prompt)
            if not response.startswith("Error:"):
                return response
            logger.warning("GitHub Models API failed, trying OpenAI as fallback")

        # Fallback to OpenAI if available
        if self.openai_key:
            return self._call_openai_api(prompt)

        return "Error: All API calls failed. Please check your API keys and network connection."

    def _call_github_models_api(self, prompt: str) -> str:
        """
        Call GitHub Models inference API

        Args:
            prompt: Prompt to send to the model

        Returns:
            LLM response
        """
        headers = {
            "Authorization": f"Bearer {self.github_token}",
            "Content-Type": "application/json"
        }

        data = {
            "messages": [
                {
                    "role": "system",
                    "content": "You are a helpful assistant specialized in document analysis and summarization."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "model": self.model,
            "max_tokens": 1000,
            "temperature": 0.3
        }

        try:
            response = requests.post(
                f"{self.endpoint}/chat/completions",
                headers=headers,
                json=data,
                timeout=30
            )

            if response.status_code == 200:
                result = response.json()
                if 'choices' in result and len(result['choices']) > 0:
                    return result['choices'][0]['message']['content'].strip()
                else:
                    logger.error(f"Unexpected response format: {result}")
                    return "Error: Unexpected response format from GitHub Models API"
            else:
                logger.error(f"GitHub Models API error: {response.status_code} - {response.text}")
                return f"Error: Failed to get response from GitHub Models API (Status: {response.status_code})"

        except Exception as e:
            logger.error(f"Error calling GitHub Models API: {str(e)}")
            return f"Error: {str(e)}"

    def _call_openai_api(self, prompt: str) -> str:
        """
        Call OpenAI API as fallback

        Args:
            prompt: Prompt to send to the model

        Returns:
            LLM response
        """
        headers = {
            "Authorization": f"Bearer {self.openai_key}",
            "Content-Type": "application/json"
        }

        data = {
            "model": "gpt-3.5-turbo",  # Use a widely available model
            "messages": [
                {
                    "role": "system",
                    "content": "You are a helpful assistant specialized in document analysis and summarization."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "max_tokens": 1000,
            "temperature": 0.3
        }

        try:
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=30
            )

            if response.status_code == 200:
                result = response.json()
                if 'choices' in result and len(result['choices']) > 0:
                    return result['choices'][0]['message']['content'].strip()
                else:
                    logger.error(f"Unexpected OpenAI response format: {result}")
                    return "Error: Unexpected response format from OpenAI API"
            else:
                logger.error(f"OpenAI API error: {response.status_code} - {response.text}")
                return f"Error: Failed to get response from OpenAI API (Status: {response.status_code})"

        except Exception as e:
            logger.error(f"Error calling OpenAI API: {str(e)}")
            return f"Error: {str(e)}"

def create_document_summary(page_texts: Dict[int, Dict], combined_text: str, output_dir: str) -> Dict:
    """
    Create comprehensive document summary using GitHub LLM

    Args:
        page_texts: Dictionary of page texts from OCR
        combined_text: Combined text from all pages
        output_dir: Directory to save summary files

    Returns:
        Dictionary containing all summary information
    """
    try:
        # Initialize GitHub LLM summarizer
        summarizer = GitHubLLMDocumentSummarizer()

        # Create summaries
        document_summary = summarizer.summarize_document(combined_text)
        document_type = summarizer.detect_document_type(combined_text)
        key_info = summarizer.extract_key_information(combined_text)

        # Summarize each page
        page_summaries = {}
        for page_num, page_info in page_texts.items():
            page_summary = summarizer.summarize_page(page_info['text'], page_num)
            page_summaries[page_num] = page_summary

        # Create comprehensive summary
        summary_data = {
            "document_type": document_type,
            "overall_summary": document_summary,
            "page_summaries": page_summaries,
            "key_information": key_info,
            "metadata": {
                "total_pages": len(page_texts),
                "total_characters": len(combined_text),
                "languages_detected": list(set([info['language'] for info in page_texts.values()]))
            }
        }

        # Save summary to file
        summary_path = os.path.join(output_dir, "document_summary.json")
        with open(summary_path, 'w', encoding='utf-8') as f:
            json.dump(summary_data, f, indent=2, ensure_ascii=False)

        # Save readable summary
        readable_summary_path = os.path.join(output_dir, "document_summary.txt")
        with open(readable_summary_path, 'w', encoding='utf-8') as f:
            f.write("DOCUMENT ANALYSIS SUMMARY\n")
            f.write("="*50 + "\n\n")
            f.write(f"Document Type: {document_type}\n\n")
            f.write(f"Overall Summary:\n{document_summary}\n\n")
            f.write("Key Information:\n")
            for category, items in key_info.items():
                if items:
                    f.write(f"  {category.replace('_', ' ').title()}: {', '.join(items)}\n")
            f.write("\nPage-by-Page Summaries:\n")
            for page_num, summary in page_summaries.items():
                f.write(f"  Page {page_num}: {summary}\n")

        logger.info(f"Document summary saved to {summary_path}")
        return summary_data

    except Exception as e:
        logger.error(f"Error creating document summary: {str(e)}")
        return {
            "error": str(e),
            "document_type": "unknown",
            "overall_summary": "Failed to generate summary",
            "page_summaries": {},
            "key_information": {},
            "metadata": {}
        }
