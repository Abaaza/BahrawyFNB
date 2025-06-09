# Portal Example

This project includes a small Express API and a React client. Data is persisted in MongoDB instead of the previous `server/database.json` file.

## Example Credentials

You can log in using the following sample account:

- **Username:** `demo`
- **Password:** `demo123`

These values are for testing only.

## API Overview

### Users
- `GET /users` – list all users
- `POST /users` – add a new user (`{ username, password }`)

### Authentication
- `POST /auth/register` – create a new account (`{ name, email, password, role }`)
- `POST /auth/login` – obtain a JWT (`{ email, password }`)

### Projects
- `GET /projects` – list all projects
- `POST /projects` – add a new project (`{ name, description }`)
- `POST /api/generate-draft-report` – create a draft report from case data

The existing `/portal` routes for case management continue to work as before.
Use `POST /portal/signup` and `POST /portal/login` with `username` and `password`
to access these endpoints.

## Connecting the Frontend

Set `VITE_API_BASE_URL` in `client/.env` to your deployed API URL. Example:

```
VITE_API_BASE_URL=https://u9x019avhh.execute-api.me-south-1.amazonaws.com
```

## Backend Configuration

Create a `.env` file inside the `server` directory based on `.env.example` and
provide your MongoDB Atlas password. Example:

```bash
cp server/.env.example server/.env
# edit server/.env and replace <db_password>
```

The Express server will automatically connect to the `MONGO_URI` when it starts.

### Email Configuration

Emails are sent using SendGrid if `SENDGRID_API_KEY` is provided. If not, the
server falls back to SMTP settings with Nodemailer. Set the following variables
in `server/.env`:

```bash
# SendGrid
SENDGRID_API_KEY=<your-key>
NOTIFY_FROM_EMAIL=noreply@example.com

# SMTP fallback
SMTP_HOST=<smtp-host>
SMTP_PORT=587
SMTP_USER=<smtp-user>
SMTP_PASS=<smtp-pass>
```
