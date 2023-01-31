#!/bin/bash

set -e

echo "checking for dhparams.pem"

if [ ! -f "/etc/letsencrypt/ssl-dhparams.pem"]; then
 echo "dhparams.pem does not exist - creating it"


 openssl dhparams -out /etc/letsencrypt/ssl-dhparams.pem 2048

fi

# Avoid replacing these envsubst
export host=\$host
export request_uri=\$request_uri

echo "checking for fullchain.pem"
if [ ! -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"]; then
    echo "NO SSl cert, enabling HTTP only"
    envsubst < /etc/nginx/default.conf.tpl > /etc/nginx/conf.d/default.conf

else
    echo "SSl cert exists, enabling HTTPS..."
    envsubst < /etc/nginx/default-ssl.conf.tpl > /etc/nginx/conf.d/default.conf

fi

nginx -g 'daemon off;'

