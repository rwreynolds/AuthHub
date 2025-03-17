#!/bin/zsh
# Simple script to create the folder structure with empty files

echo "Creating App Embedding Platform project structure..."

# Create the frontend directory structure
mkdir -p frontend/public
mkdir -p frontend/src/app/login
mkdir -p frontend/src/app/dashboard
mkdir -p frontend/src/components
mkdir -p frontend/src/lib
mkdir -p frontend/src/contexts

# Create the backend directory structure
mkdir -p backend/app/auth
mkdir -p backend/app/users
mkdir -p backend/app/preferences
mkdir -p backend/app/embedded_apps

# Create empty frontend files
touch frontend/next.config.js
touch frontend/package.json
touch frontend/middleware.js
touch frontend/src/app/globals.css
touch frontend/src/app/layout.js
touch frontend/src/app/page.js
touch frontend/src/app/login/page.js
touch frontend/src/app/dashboard/page.js
touch frontend/src/components/AppIFrame.jsx
touch frontend/src/components/AppSwitcher.jsx
touch frontend/src/components/LoadingScreen.jsx
touch frontend/src/components/AuthProvider.jsx
touch frontend/src/lib/auth.js
touch frontend/src/lib/api.js
touch frontend/src/contexts/AuthContext.js

# Create empty backend files
touch backend/app/__init__.py
touch backend/app/main.py
touch backend/app/auth/__init__.py
touch backend/app/auth/router.py
touch backend/app/auth/jwt.py
touch backend/app/auth/models.py
touch backend/app/users/__init__.py
touch backend/app/users/router.py
touch backend/app/users/models.py
touch backend/app/preferences/__init__.py
touch backend/app/preferences/router.py
touch backend/app/preferences/models.py
touch backend/app/embedded_apps/__init__.py
touch backend/app/embedded_apps/router.py
touch backend/app/embedded_apps/models.py
touch backend/requirements.txt
touch backend/Dockerfile

# Create docker-compose.yml
touch docker-compose.yml

echo "Project structure with empty files created successfully!"