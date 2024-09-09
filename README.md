## Field Tracker
This repo provides a backend API service and frontend web client to track and manage field data.  

- The backend API is built with PostgresQL, PostGIS, Django and Django Rest Framework
- The frontend client is built with React and Material UI

### Build and start the services
`docker-compose up --build`

This command will build the images for the backend and frontend services, run migrations for the backend service, and start containers for each image. There is a data migration that creates two groups (Silverton and Pepperidge), and a user for each of those respective groups: `pepperidge@example.com`, `silverton@example.com`. The password for both of these users is `intelligence`

The data migration also creates a superuser with email `arva@example.com` and password `intelligence`

### Local URLs
- Web client is accessible at: `http://localhost:5173/`
- Django admin is accessible at: `http://localhost:8000/admin/`
- API root is accessible at: `http://localhost:8000/api/`

### Client-side HMR
To enable HMR for the react client, start up the server with docker:
```
docker compose up django
```

Then in another terminal session, start the client:
```
cd client
npm run dev
```
