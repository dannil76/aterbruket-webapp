#!/bin/bash
# Clean local branches 
git fetch --prune

# Go through all missing origin
branches=$(git branch -vv | grep -v origin | grep feature/ | cut -d " " -f 3)

for val in ${branches[@]}; do
  echo "Found branch $val"

  read -p "Delete branch? (Y/N): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]
  then
      git branch -D $val
  fi
done

# Go through all with keyword : gone]
branches=$(git branch -vv | grep ": gone]" | grep feature/ | cut -d " " -f 3)

for val in ${branches[@]}; do
  echo "Found branch $val"

  read -p "Delete branch? (Y/N): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]
  then
      git branch -D $val
  fi
done