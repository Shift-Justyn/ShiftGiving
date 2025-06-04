#!/bin/bash

set -e # Exit immediately if a command exits with a non-zero status

STEP_DIVIDER="***********************************************"

echo "$STEP_DIVIDER"
echo "Running End-to-End Tests"
npm run e2e

echo "✅  End-to-End Tests have Passed"
echo ""
