#!/bin/bash
# Wait for the database to be available
while ! nc -z db 5432; do
  echo "Waiting for database..."
  sleep 1
done

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# Start the server
echo "Starting server..."
exec python manage.py runserver 0.0.0.0:8000
