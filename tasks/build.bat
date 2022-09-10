cd .\packages\ui
call yarn build

cd ..\core
call yarn build

cd ..\inject
call yarn build

cd ..\website
call yarn build

cd ..\extension
call yarn build
