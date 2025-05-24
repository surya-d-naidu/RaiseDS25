#!/bin/bash

# This script generates self-signed SSL certificates for RAISEDS25
# For production, you should replace these with certificates from a trusted CA or Let's Encrypt

SSL_DIR="/root/raiseds25/project/ssl"
DOMAIN="raiseds25.org"
ALTERNATIVE_NAMES="DNS:www.$DOMAIN,DNS:$DOMAIN"

# Create directory for SSL certificates
mkdir -p $SSL_DIR

echo "Generating self-signed SSL certificate for $DOMAIN..."

# Generate private key and self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout $SSL_DIR/server.key \
  -out $SSL_DIR/server.crt \
  -subj "/CN=$DOMAIN" \
  -addext "subjectAltName=$ALTERNATIVE_NAMES"

# Set permissions
chmod 600 $SSL_DIR/server.key
chmod 644 $SSL_DIR/server.crt

echo "✅ SSL certificate generated successfully in $SSL_DIR"
echo "⚠️  Warning: This is a self-signed certificate for development only."
echo "    For production, use a trusted CA or Let's Encrypt certificate."
