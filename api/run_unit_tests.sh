#!/bin/bash

set -e # Exit immediately if a command exits with a non-zero status

STEP_DIVIDER="***********************************************"

echo "$STEP_DIVIDER"
echo "Running Unit & Integration Tests"
cd "ShiftGiving.Tests"
npm run test
cd ../

echo "✅  Unit & Integration Tests have Passed"
echo ""