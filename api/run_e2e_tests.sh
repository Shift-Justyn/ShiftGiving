#!/bin/bash

set -e # Exit immediately if a command exits with a non-zero status

STEP_DIVIDER="***********************************************"

echo "$STEP_DIVIDER"
echo "Running End-to-End Tests"
cd "ShiftGiving.Tests"
npm run e2e
cd ../

echo "✅  End-to-End Tests have Passed"
echo ""