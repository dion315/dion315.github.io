@echo off
ipconfig /flushdns
ipconfig /registerdns
set root=c:
mkdir c:\DesktopCentralAgent
copy \\rf-sccm-pr02\SOURCE\Content\Software\DesktopCentralAgent\*.* C:\DesktopCentralAgent\*.*
cd c:\DesktopCentralAgent
If exist "c:\DesktopCentralAgent\DMRootCA.crt" (
    start /wait msiexec /i UEMSAgent.msi TRANSFORMS="UEMSAgent.mst" ENABLESILENT=yes REBOOT=ReallySuppress INSTALLSOURCE=Manual SERVER_ROOT_CRT="%cd%\DMRootCA-Server.crt" DS_ROOT_CRT="%cd%\DMRootCA.crt" /lv Agentinstalllog.txt 
	Exit
) else (
	Exit
)
rmdir /s c:\DesktopCentralAgent
exit /b %ERRORLEVEL%



