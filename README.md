# Portal Example

This project includes a small Express API and a React client. It now ships with a sample database stored in `server/database.json` which holds example users and projects.

## Example Credentials

You can log in using the following sample account:

- **Username:** `demo`
- **Password:** `demo123`

These values are for testing only.

## API Overview

### Users
- `GET /users` – list all users
- `POST /users` – add a new user (`{ username, password }`)

### Projects
- `GET /projects` – list all projects
- `POST /projects` – add a new project (`{ name, description }`)

The existing `/portal` routes for case management continue to work as before.