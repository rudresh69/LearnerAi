# Use official Python image
FROM python:3.11-slim

# Install OS-level dependencies including Google Chrome
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Install Google Chrome (stable)
RUN curl -fsSL https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-linux-keyring.gpg && \
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && apt-get install -y google-chrome-stable && \
    rm -rf /var/lib/apt/lists/*

# Install Node.js (latest LTS) and avoid npm idealTree bug
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm cache clean --force

# Install Mermaid CLI globally
RUN npm install -g @mermaid-js/mermaid-cli

# Install Puppeteer locally so Mermaid CLI can use it
RUN npm install puppeteer --omit=dev

# Set Puppeteer executable path to Google Chrome
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# Optional: create Puppeteer cache folder for Render
RUN mkdir -p /opt/render/project/.cache/puppeteer

# Create working directory
WORKDIR /app

# Copy project files
COPY . .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Expose port
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=src/api/server.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000

# Start the Flask app
CMD ["flask", "run"]
