class User {
  constructor({ name, email, passwordHash, role }) {
    this.id = null; // assigned when stored
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role; // 'dentist' or 'specialist'
  }
}

module.exports = User;
