# Use Node.js base image with Python pre-installed
FROM nikolaik/python-nodejs:python3.12-nodejs22

# Set environment variables for Python and Node.js
ENV NODE_ENV=development

# ------------ Site Setup (Node.js Application) ------------
# Set working directory for Node.js backend
WORKDIR /workspaces/newsletter/site

# Copy backend dependency files and install dependencies
COPY site/package.json site/package-lock.json ./
RUN npm install

# Copy backend source code
COPY site/ .

# Set working directory for the frontend
WORKDIR /workspaces/newsletter/site/site-frontend

# Copy frontend dependency files and install dependencies
COPY site/site-frontend/package.json site/site-frontend/package-lock.json ./
RUN npm install && echo "Frontend dependencies installed."
COPY site/site-frontend/ ./

# ------------ Transcription Service Setup (Python Application) ------------
# Set working directory for the Python transcription service
WORKDIR /workspaces/newsletter/transcription_service

# Copy Python dependency files and source code
COPY transcription_service/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY transcription_service/ ./

# ------------ Expose Ports ------------
# Expose frontend (React), backend (Node.js), and transcription service (Python)
EXPOSE 5173
EXPOSE 8080
EXPOSE 6379  

# ------------ Default Command ------------
# Run both services concurrently
CMD [""]