const User = require('./models/User');
const Project = require('./models/Project');
const Case = require('./models/Case');
const Review = require('./models/Review');
const ClinicalStatement = require('./models/ClinicalStatement');

async function getUsers() {
  return User.find().lean();
}

async function addUser(user) {
  const doc = await User.create(user);
  return doc.toObject();
}

async function getUser(id) {
  return User.findById(id).lean();
}

async function getProjects() {
  return Project.find().lean();
}

async function addProject(project) {
  const doc = await Project.create(project);
  return doc.toObject();
}

async function getProject(id) {
  return Project.findById(id).lean();
}

async function updateProject(id, updates) {
  return Project.findByIdAndUpdate(id, updates, { new: true }).lean();
}

async function getCases() {
  return Case.find().lean();
}

async function addCase(caseItem) {
  const doc = await Case.create(caseItem);
  return doc.toObject();
}

async function updateCase(id, updates) {
  return Case.findByIdAndUpdate(id, updates, { new: true }).lean();
}

async function deleteCase(id) {
  const res = await Case.findByIdAndDelete(id);
  return !!res;
}

async function getCase(id) {
  return Case.findById(id).lean();
}

async function getReviews() {
  return Review.find().lean();
}

async function addReview(review) {
  const doc = await Review.create(review);
  return doc.toObject();
}

async function getReviewsForCase(caseId) {
  return Review.find({ caseId }).lean();
}

async function getClinicalStatements() {
  return ClinicalStatement.find().lean();
}

async function addClinicalStatement(statement) {
  const doc = await ClinicalStatement.create(statement);
  return doc.toObject();
}

module.exports = {
  getUsers,
  addUser,
  getUser,
  getProjects,
  getProject,
  addProject,
  updateProject,
  getCases,
  addCase,
  updateCase,
  deleteCase,
  getCase,
  getReviews,
  addReview,
  getReviewsForCase,
  getClinicalStatements,
  addClinicalStatement,
};
