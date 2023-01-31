FROM certbot/certbot:v1.27.0

COPY certify-init.sh /opt/

RUN  chmod +x /opt/certify-init.sh

ENTRYPOINT []

#command: certonly -v --dry-run --webroot --webroot-path=/var/www
#           --preferred-challenges http-01 --email email@gmail.com
#           --agree-tos --no-eff-email --non-interactive --force-renewal
#           -d example.com -d www.example.com

CMD ["certbot","renew"]