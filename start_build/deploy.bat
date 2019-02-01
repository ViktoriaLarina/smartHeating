start /wait putty -ssh -i C:\Users\Vika\.ssh\zaiets.ppk root@94.130.78.151:/opt/bioprom-server-app/frontend -m "F:\bioprom\bioprom-server\client\start build\putty.sh"
start /wait pscp  -i C:\Users\Vika\.ssh\zaiets.ppk -r F:/bioprom/bioprom-server/client/dist root@94.130.78.151:/opt/bioprom-server-app/frontend
echo DONE!
pause