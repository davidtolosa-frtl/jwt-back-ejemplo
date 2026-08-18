// Base de datos "en memoria" solo para fines demostrativos.
// En una app real esto sería una tabla en una base de datos persistente.

const users = [];
let nextId = 1;

function findByUsername(username) {
  return users.find((u) => u.username === username);
}

function findById(id) {
  return users.find((u) => u.id === id);
}

function createUser({ username, passwordHash }) {
  const user = { id: nextId++, username, passwordHash };
  users.push(user);
  return user;
}

module.exports = { findByUsername, findById, createUser };
