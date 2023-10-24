call yarn run build
cd dist
powershell Compress-Archive -Force * ..\chat_build.zip
cd ..