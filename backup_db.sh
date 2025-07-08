#!/bin/bash

# Database backup script
export PGPASSWORD='Lucky_raiseds@25'
BACKUP_DIR="/root/raiseds25/project/backup"
DB_NAME="raiseds_25"
DB_USER="postgres"
DB_HOST="localhost"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate backup filename with timestamp
DUMP_FILE="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).dump"

# Create database backup
pg_dump -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -Fc -f "$DUMP_FILE"

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Backup created successfully: $DUMP_FILE"
    
    # Keep only the 3 most recent backups
    ls -1t "$BACKUP_DIR"/backup_*.dump | tail -n +4 | xargs -r rm --
    
    echo "Old backups cleaned up, keeping latest 3 backups"
else
    echo "Backup failed"
    exit 1
fi
