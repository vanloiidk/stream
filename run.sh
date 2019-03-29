url1=""
url2=""
url3=""
echo $url2
cd /home/vanloi/Downloads/ngrok-stable-linux-amd64/
gnome-terminal -e "bash -c \"ngrok http 3000; exec bash\"" &
sleep 5
gnome-terminal -e "bash -c \"ngrok http 3001; exec bash\"" &
sleep 5
gnome-terminal -e "bash -c \"ngrok http 3002; exec bash\""
sleep 5




url1=$(curl --silent --show-error http://127.0.0.1:4040/api/tunnels | sed -nE 's/.*public_url":"https:..([^"]*).*/\1/p')	
url2=$(curl --silent --show-error http://127.0.0.1:4041/api/tunnels | sed -nE 's/.*public_url":"https:..([^"]*).*/\1/p')
url3=$(curl --silent --show-error http://127.0.0.1:4042/api/tunnels | sed -nE 's/.*public_url":"https:..([^"]*).*/\1/p')

echo $url1
echo $url2
echo $url3

echo "const isProduction = true;">/home/vanloi/tutorials/stream/web/src/config.js

echo "export const api = isProduction ? 'http://$url2' : ' http://localhost:3001';">>/home/vanloi/tutorials/stream/web/src/config.js
echo "export const source = isProduction ? 'http://$url3': 'http/localhost:3002';">>/home/vanloi/tutorials/stream/web/src/config.js

ip=$(ip addr show wlp2s0 | grep "inet\b" | awk '{print $2}' | cut -d/ -f1)

sed -i '49d' /home/linuxbrew/.linuxbrew/etc/nginx/nginx.conf
sed "49i server_name server.com $ip;" /home/linuxbrew/.linuxbrew/etc/nginx/nginx.conf > /home/vanloi/Documents/nginx.conf
cp -rf /home/vanloi/Documents/nginx.conf /home/linuxbrew/.linuxbrew/etc/nginx/

if [ -e /home/linuxbrew/.linuxbrew/var/run/nginx.pid ]; then echo nginx -s reload; else nginx; fi

sleep 5
gnome-terminal -e "bash -c \"echo vanloi11c|sudo -S mongod; exec bash\""&

sleep 5

gnome-terminal -e "bash -c \"cd /home/vanloi/tutorials/stream/api && npm start; exec bash\""

gnome-terminal -e "bash -c \"cd /home/vanloi/tutorials/stream/web && npm start; exec bash\""





echo "no deo chay lan 2"
wait


