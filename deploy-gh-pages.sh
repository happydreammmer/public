#!/bin/bash

# Copy built files to root directories for GitHub Pages
echo "Copying build files for GitHub Pages deployment..."

# Meeting Agent
if [ -d "meeting-agent/build" ]; then
  echo "Deploying meeting-agent..."
  cp -r meeting-agent/build/* meeting-agent/
fi

# Dictator
if [ -d "dictator/build" ]; then
  echo "Deploying dictator..."
  cp -r dictator/build/* dictator/
fi

# DeepTube
if [ -d "deeptube/build" ]; then
  echo "Deploying deeptube..."
  cp -r deeptube/build/* deeptube/
fi

# Osee
if [ -d "osee/build" ]; then
  echo "Deploying osee..."
  cp -r osee/build/* osee/
fi

# Country Data
if [ -d "country-data/build" ]; then
  echo "Deploying country-data..."
  cp -r country-data/build/* country-data/
fi

echo "Deployment preparation complete!"