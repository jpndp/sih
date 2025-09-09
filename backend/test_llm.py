import os
import load_env  # Load environment variables
from llm_summarizer import GitHubLLMDocumentSummarizer

def test_github_models_api():
    """
    Test the GitHub Models API integration
    """
    print("🧪 Testing GitHub Models API Integration")
    print("=" * 50)

    # Check if token is available
    github_token = os.getenv('GITHUB_TOKEN')
    if not github_token:
        print("❌ GITHUB_TOKEN not found in environment variables")
        print("💡 Please run: python setup_token.py")
        return

    print(f"✅ GitHub token found: {github_token[:10]}...")
    print(f"🔍 Token type: {github_token[:3]}...")

    # Check token format
    if github_token.startswith('ghp_'):
        print("📝 Using classic GitHub token")
        print("⚠️  Note: GitHub Models may require a different token type")
    elif github_token.startswith('github_pat_'):
        print("📝 Using fine-grained personal access token")
    else:
        print("📝 Using custom token format")

    # Initialize summarizer
    try:
        summarizer = GitHubLLMDocumentSummarizer(github_token=github_token)
        print("✅ Summarizer initialized successfully")
        print(f"🔗 Endpoint: {summarizer.endpoint}")
        print(f"🤖 Model: {summarizer.model}")
    except Exception as e:
        print(f"❌ Failed to initialize summarizer: {e}")
        return

    # Test simple prompt
    test_prompt = "Hello! Please respond with a simple greeting and confirm you are working."

    print("\n🤖 Testing API call...")
    try:
        response = summarizer._call_github_llm(test_prompt)
        print("✅ API call successful!")
        print(f"📝 Response: {response}")

        # Check if response contains expected content
        if "error" in response.lower():
            print("⚠️  Response contains error - check token permissions")
            print("\n🔧 Troubleshooting:")
            print("1. Ensure your GitHub token has the correct scopes")
            print("2. Try using a fine-grained personal access token")
            print("3. Check if GitHub Models is enabled for your account")
            print("4. Visit: https://github.com/marketplace/models")
        else:
            print("🎉 GitHub Models API is working correctly!")

    except Exception as e:
        print(f"❌ API call failed: {e}")
        print("\n� Possible solutions:")
        print("1. Check your internet connection")
        print("2. Verify GitHub token permissions")
        print("3. Try using OpenAI API instead (set OPENAI_API_KEY)")
        print("4. Check GitHub Models service status")

def show_alternative_setup():
    """
    Show alternative setup options
    """
    print("\n🔄 Alternative Setup Options:")
    print("=" * 40)
    print("1. Use OpenAI API instead:")
    print("   - Get API key from: https://platform.openai.com/api-keys")
    print("   - Set OPENAI_API_KEY in .env file")
    print("   - The system will automatically use OpenAI")
    print()
    print("2. Use Ollama (local models):")
    print("   - Install Ollama: https://ollama.ai")
    print("   - Run: ollama pull llama2")
    print("   - The system supports Ollama integration")
    print()
    print("3. Fix GitHub token:")
    print("   - Create fine-grained token: https://github.com/settings/tokens")
    print("   - Select repository access")
    print("   - Enable GitHub Models access")

if __name__ == "__main__":
    test_github_models_api()
    show_alternative_setup()
