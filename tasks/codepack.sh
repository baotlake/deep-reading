#!/usr/bin/env bash

mkdir -p deep-reading-code/packages/core/src
mkdir -p deep-reading-code/packages/ui/src
mkdir -p deep-reading-code/packages/extension/src


cp -r ../docs ./deep-reading-code/

cp -r ../packages/core/src/* ./deep-reading-code/packages/core/src
cp ../packages/core/.* ./deep-reading-code/packages/core/
cp ../packages/core/* ./deep-reading-code/packages/core/

cp -r ../packages/ui/src/* ./deep-reading-code/packages/ui/src
cp ../packages/ui/* ./deep-reading-code/packages/ui/

cp -r ../packagers/extension/src/* ./deep-reading-code/packages/src
cp ../packages/extension/* ./deep-reading-code/packages/extension/

cp ../* ./deep-reading-code/

