call yarn run build

cd dist
mkdir config
copy ..\config\eventChatConfig.js .\config\

powershell Compress-Archive -Force * ..\chat_build_event_chat.zip
cd ..
xcopy dist\* C:\development\playground\agents\event_management_agent\ui /e/s