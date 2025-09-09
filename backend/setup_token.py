import os

def setup_github_token():
    """
    Setup GitHub token for LLM summarization
    """
    print("🔑 GitHub Token Setup for LLM Summarization")
    print("=" * 50)

    # Check if token already exists
    existing_token = os.getenv('GITHUB_TOKEN')
    if existing_token:
        print("✅ GitHub token is already configured!")
        print(f"Token: {existing_token[:10]}...")
        return

    print("\n📋 To get your GitHub token:")
    print("1. Go to: https://github.com/settings/tokens")
    print("2. Click 'Generate new token (classic)'")
    print("3. Give it a name like 'Document-Summarizer'")
    print("4. Select scopes: 'repo', 'read:user', 'read:org'")
    print("5. Click 'Generate token'")
    print("6. Copy the token (save it somewhere safe!)")

    print("\n🔐 Enter your GitHub token below:")
    token = input("GitHub Token: ").strip()

    if token:
        # Set environment variable for current session
        os.environ['GITHUB_TOKEN'] = token

        # Update .env file for persistence
        env_file = os.path.join(os.getcwd(), '.env')

        # Read existing .env file
        env_content = ""
        if os.path.exists(env_file):
            with open(env_file, 'r') as f:
                env_content = f.read()

        # Update or add GITHUB_TOKEN
        if 'GITHUB_TOKEN=' in env_content:
            # Replace existing token
            lines = env_content.split('\n')
            for i, line in enumerate(lines):
                if line.startswith('GITHUB_TOKEN='):
                    lines[i] = f'GITHUB_TOKEN={token}'
                    break
            env_content = '\n'.join(lines)
        else:
            # Add new token
            if env_content and not env_content.endswith('\n'):
                env_content += '\n'
            env_content += f'GITHUB_TOKEN={token}\n'

        # Write updated content
        with open(env_file, 'w') as f:
            f.write(env_content)

        print("✅ GitHub token configured successfully!")
        print("📁 Token saved to .env file for future use")
        print("\n🚀 You can now run the document summarizer!")
        print("   Run: python script.py")
    else:
        print("❌ No token provided. LLM features will not work.")

if __name__ == "__main__":
    setup_github_token()
