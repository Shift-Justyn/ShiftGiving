#!/bin/bash

set -e # Exit immediately if a command exits with a non-zero status

STEP_DIVIDER="***********************************************"

echo "$STEP_DIVIDER"
echo "Running Code Formatting Check"
dotnet format --verify-no-changes --verbosity diagnostic
echo "[OK] Code Formatting Check Passed"
echo ""
