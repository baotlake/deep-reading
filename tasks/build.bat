cd .\packages\ui
call npm run build

cd ..\core
call npm run build

cd ..\inject
call npm run build

cd ..\website
call npm run build
call npm run export

cd ..\extension
call npm run build
