cd /tmp

wget https://git.apad.pro/https://github.com/pmkol/mosdns-x/releases/download/v25.12.05/mosdns-linux-arm64.zip
wget https://git.apad.pro/https://raw.githubusercontent.com/YiXuanZX/rules/mosdns/easymosdns.tar.gz

unzip mosdns-linux-arm64.zip "mosdns" -d /usr/bin
chmod +x /usr/bin/mosdns

tar xzf easymosdns.tar.gz
mv easymosdns /etc/mosdns

chmod +x /etc/mosdns/rules/update-cdn
/etc/mosdns/rules/update-cdn

rm mosdns-linux-arm64.zip easymosdns.tar.gz

mosdns service install -d /etc/mosdns -c config.yaml
mosdns service start