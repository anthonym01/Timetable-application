@echo off
echo "Running Cordova setup command (npm i cordova)"
npm i cordova
SET /A choice=0
echo "Cordova settup should now be completed"
pause

        <splash src="res/splashscreen/base.png"/>
        <preference name="AutoHideSplashScreen" value="true" />
        <preference name="SplashScreenDelay" value="5000" />
        <preference name="ShowSplashScreenSpinner" value="false"/>
        <preference name="SplashScreenSpinnerColor" value="white" />