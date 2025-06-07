# Use official Python image
FROM python:3.11-slim

# Install OS-level dependencies
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
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js (latest LTS)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g @mermaid-js/mermaid-cli

# Create working directory
WORKDIR /app

# Copy project files
COPY . .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Add Puppeteer Chromium path to environment
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Optional: Make sure the cache folder exists
RUN mkdir -p /opt/render/project/.cache/puppeteer

# Let puppeteer download Chromium (needed for mermaid-cli)
RUN npm install puppeteer --omit=dev

# Expose port
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=src/api/server.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000

# Start the app
CMD ["flask", "run"]
