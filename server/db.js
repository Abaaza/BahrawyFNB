const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.json');

function loadDB() {
  if (!fs.existsSync(DB_PATH)) {
    const initial = { users: [], projects: [], cases: [], reviews: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  if (!('reviews' in data)) data.reviews = [];
  return data;}

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

function getCases() {
  const db = loadDB();
  return db.cases;
}

function addCase(caseItem) {
  const db = loadDB();
  caseItem.id = db.cases.length ? db.cases[db.cases.length - 1].id + 1 : 1;
  db.cases.push(caseItem);
  saveDB(db);
  return caseItem;
}

function updateCase(id, updates) {
  const db = loadDB();
  const c = db.cases.find((k) => k.id === id);
  if (!c) return null;
  Object.assign(c, updates);
  saveDB(db);
  return c;
}

function deleteCase(id) {
  const db = loadDB();
  const idx = db.cases.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  db.cases.splice(idx, 1);
  saveDB(db);
  return true;
}
function getCase(id) {
  const db = loadDB();
  return db.cases.find((c) => c.id === id) || null;
}

function getReviews() {
  const db = loadDB();
  return db.reviews;
}

function addReview(review) {
  const db = loadDB();
  review.id = db.reviews.length ? db.reviews[db.reviews.length - 1].id + 1 : 1;
  db.reviews.push(review);
  saveDB(db);
  return review;
}

function getReviewsForCase(caseId) {
  const db = loadDB();
  return db.reviews.filter((r) => r.caseId === caseId);
}


module.exports = {
  loadDB,
  saveDB,
  getUsers,
  addUser,
  getProjects,
  addProject,
  getCases,
  addCase,
  updateCase,
  deleteCase,
  getCase,
  getReviews,
  addReview,
  getReviewsForCase,
};