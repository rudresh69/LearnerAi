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
    libgdk-pixbuf-2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Install Google Chrome stable
RUN curl -fsSL https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-linux-keyring.gpg && \
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && apt-get install -y google-chrome-stable && \
    rm -rf /var/lib/apt/lists/*

# Install Node.js (LTS) and clean up npm cache
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm cache clean --force

# Install Mermaid CLI and Puppeteer globally
RUN npm install -g @mermaid-js/mermaid-cli puppeteer

# Set Puppeteer executable path to Google Chrome
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# Create Puppeteer cache folder for Render compatibility
RUN mkdir -p /opt/render/project/.cache/puppeteer

# Create working directory
WORKDIR /app

# Copy project files
COPY . .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Expose the dynamic port (default 5000)
ARG PORT=5000
ENV PORT=${PORT}

EXPOSE ${PORT}

# Set environment variables for Flask to run on dynamic port
ENV FLASK_APP=src/api/server.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=${PORT}

# Start the app
CMD ["flask", "run"]
