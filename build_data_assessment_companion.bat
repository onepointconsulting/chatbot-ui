SET CONFIG=..\config\dataAssessmentConfig.js
SET BUILD_NAME=chat_build_data_assessment_companion.zip
SET UI_FOLDER=C:\development\playground\agents\data_assessment_agent\ui

call yarn run build

cd dist
mkdir config
copy %CONFIG% .\config\

powershell Compress-Archive -Force * ..\%BUILD_NAME%
cd ..
xcopy dist\* %UI_FOLDER% /e/s