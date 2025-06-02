const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.json');

function loadDB() {
  if (!fs.existsSync(DB_PATH)) {
    const initial = { users: [], projects: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function getUsers() {
  const db = loadDB();
  return db.users;
}

function addUser(user) {
  const db = loadDB();
  user.id = db.users.length ? db.users[db.users.length - 1].id + 1 : 1;
  db.users.push(user);
  saveDB(db);
  return user;
}

function getProjects() {
  const db = loadDB();
  return db.projects;
}

function addProject(project) {
  const db = loadDB();
  project.id = db.projects.length ? db.projects[db.projects.length - 1].id + 1 : 1;
  db.projects.push(project);
  saveDB(db);
  return project;
}

module.exports = {
  loadDB,
  saveDB,
  getUsers,
  addUser,
  getProjects,
  addProject,
};