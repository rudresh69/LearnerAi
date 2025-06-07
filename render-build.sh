#!/bin/bash

# Exit on error
set -e

# Step 1: Install Mermaid CLI globally
npm install -g @mermaid-js/mermaid-cli

# Step 2: Install Chromium via Puppeteer (this downloads browser files)
npx puppeteer browsers install chrome

# Step 3: Install Python dependencies
pip install -r requirements.txt
