#!/bin/bash
# Run this from your malickland.net folder to commit and push all changes
# Usage: bash push-to-github.sh

set -e

echo "→ Removing stale git lock (if any)..."
rm -f .git/index.lock

echo "→ Staging all changes..."
git add -A

echo "→ Committing..."
git commit -m "Rebrand to MalickLand WV Real Estate Agency + contact form + maps"

echo "→ Pushing to GitHub..."
git push origin main

echo ""
echo "✓ Done! Vercel will auto-deploy in ~60 seconds."
echo "  Check progress at: https://vercel.com/dashboard"
