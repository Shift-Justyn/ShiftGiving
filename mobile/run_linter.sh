#!/bin/bash

set -e # Exit immediately if a command exits with a non-zero status

echo "$STEP_DIVIDER"
echo "Running Linter"
npm run lint
echo "✅  Linter has Passed"
echo ""