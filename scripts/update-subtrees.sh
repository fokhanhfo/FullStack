#!/bin/bash

set -e

# Các repo con và URL tương ứng
declare -A REPOS=(
  ["FE"]="https://github.com/fokhanhfo/ReactJsWeb.git"
  ["BE"]="https://github.com/fokhanhfo/BackEndEcommerce.git"
)

BRANCH="master"

echo "🔁 Updating subtrees..."

for FOLDER in "${!REPOS[@]}"; do
  URL="${REPOS[$FOLDER]}"
  echo ""
  echo "👉 Pulling from $URL into $FOLDER/ ..."
  git subtree pull --prefix="$FOLDER" "$URL" "$BRANCH" --squash
done

echo ""
echo "✅ All subtrees updated."
