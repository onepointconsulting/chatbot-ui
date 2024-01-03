SET CONFIG=..\config\eventChatConfig.js
SET BUILD_NAME=chat_build_event_chat.zip
SET UI_FOLDER=C:\development\playground\agents\event_management_agent\ui

call yarn run build

cd dist
mkdir config
copy %CONFIG% .\config\

powershell Compress-Archive -Force * ..\%BUILD_NAME%
cd ..
xcopy dist\* %UI_FOLDER% /e/s