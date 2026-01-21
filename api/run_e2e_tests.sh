#!/bin/bash

set -e # Exit immediately if a command exits with a non-zero status

STEP_DIVIDER="***********************************************"

echo "$STEP_DIVIDER"
echo "Running End-to-End Tests"
cd "ShiftGiving.Tests"
dotnet test --filter "Category=E2E" --verbosity normal
cd ../

echo "[OK] End-to-End Tests have Passed"
echo ""
