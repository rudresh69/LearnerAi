#!/bin/bash

# Install curl and Node.js setup script
apt-get update
apt-get install -y curl

# Setup Node.js 18 repo and install nodejs
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install Mermaid CLI globally
npm install -g @mermaid-js/mermaid-cli
