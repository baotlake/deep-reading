cd ./packages/ui
npm run build

cd ../core
npm run build

cd ../inject
npm run build

cd ../website
npm run next build
npm run next export

cd ../extension
npm run build
