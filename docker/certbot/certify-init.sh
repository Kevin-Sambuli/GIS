#!/bin/sh

# waits for proxy to be available, the gets the first certificate

set -e 

until nc -z proxy 80; do # net cat
    echo "Waiting for Proxy..."
    sleep 5s & wait ${!}
done

echo "Geting Certificates"

certbot certonly \
    --webroot \
    --webroot-path "/vol/www/"\
    -d "$DOMAIN" \
    --email $EMAIL \
    --rsa-key-size 4096 \
    --agree-tos \
    --noninteractive