#!/bin/bash

set -e

echo "=========================================="
echo "Shift Giving Development Environment Setup"
echo "=========================================="
echo ""

check_homebrew() {
    if ! command -v brew &> /dev/null; then
        echo "Homebrew not found. Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

        if [[ $(uname -m) == 'arm64' ]]; then
            echo "Configuring Homebrew for Apple Silicon..."
            echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
            eval "$(/opt/homebrew/bin/brew shellenv)"
        fi

        echo "Homebrew installed successfully."
    else
        echo "✓ Homebrew is already installed."
    fi
}

install_dotnet() {
    if command -v dotnet &> /dev/null; then
        DOTNET_VERSION=$(dotnet --version | cut -d'.' -f1)
        if [[ "$DOTNET_VERSION" == "8" ]]; then
            echo "✓ .NET 8 SDK is already installed (version $(dotnet --version))."
            return
        else
            echo "Found .NET version $DOTNET_VERSION, but .NET 8 is required."
        fi
    fi

    echo "Installing .NET 8 SDK..."
    brew install --cask dotnet-sdk
    echo "✓ .NET 8 SDK installed successfully."
}

install_flutter() {
    if command -v flutter &> /dev/null; then
        FLUTTER_VERSION=$(flutter --version | grep "Flutter" | awk '{print $2}')
        echo "✓ Flutter is already installed (version $FLUTTER_VERSION)."
        return
    fi

    echo "Installing Flutter..."
    brew install --cask flutter
    echo "✓ Flutter installed successfully."
}

setup_flutter() {
    echo ""
    echo "Configuring Flutter..."

    if command -v flutter &> /dev/null; then
        flutter config --no-analytics
        flutter precache

        echo ""
        echo "Running flutter doctor to check setup..."
        flutter doctor
    fi
}

verify_installations() {
    echo ""
    echo "=========================================="
    echo "Verifying Installations"
    echo "=========================================="
    echo ""

    if command -v dotnet &> /dev/null; then
        echo "✓ .NET SDK: $(dotnet --version)"
    else
        echo "✗ .NET SDK: Not found"
    fi

    if command -v flutter &> /dev/null; then
        echo "✓ Flutter: $(flutter --version | grep "Flutter" | awk '{print $2}')"
        echo "✓ Dart: $(flutter --version | grep "Dart" | awk '{print $4}')"
    else
        echo "✗ Flutter: Not found"
    fi

    if command -v node &> /dev/null; then
        echo "✓ Node.js: $(node --version)"
    else
        echo "✗ Node.js: Not found"
    fi

    if command -v npm &> /dev/null; then
        echo "✓ npm: $(npm --version)"
    else
        echo "✗ npm: Not found"
    fi
}

add_path_instructions() {
    echo ""
    echo "=========================================="
    echo "PATH Configuration"
    echo "=========================================="
    echo ""
    echo "Flutter has been installed. You may need to add it to your PATH."
    echo ""
    echo "For zsh (default on macOS):"
    echo "  echo 'export PATH=\"\$PATH:/opt/homebrew/Caskroom/flutter/latest/flutter/bin\"' >> ~/.zshrc"
    echo "  source ~/.zshrc"
    echo ""
    echo "For bash:"
    echo "  echo 'export PATH=\"\$PATH:/opt/homebrew/Caskroom/flutter/latest/flutter/bin\"' >> ~/.bash_profile"
    echo "  source ~/.bash_profile"
    echo ""
}

main() {
    check_homebrew
    echo ""
    install_dotnet
    echo ""
    install_flutter
    echo ""
    setup_flutter
    echo ""
    verify_installations
    echo ""
    add_path_instructions
    echo ""
    echo "=========================================="
    echo "Setup Complete!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "1. Close and reopen your terminal (or run 'source ~/.zshrc')"
    echo "2. Run 'flutter doctor' to verify Flutter installation"
    echo "3. Navigate to the project root and follow README instructions"
    echo ""
}

main
