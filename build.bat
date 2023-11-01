call yarn run build
cd dist
powershell Compress-Archive -Force * ..\chat_build.zip
cd ..
xcopy dist\* C:\development\playground\langchain\onepoint-document-chat\ui /e/s