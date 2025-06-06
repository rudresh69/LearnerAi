#!/bin/bash

# Update apt and install dependencies
apt-get update
apt-get install -y curl chromium chromium-driver

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install Mermaid CLI globally
npm install -g @mermaid-js/mermaid-cli
