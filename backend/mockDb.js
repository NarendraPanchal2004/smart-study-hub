const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');

const getDb = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], groups: [], messages: [], timetables: [], tasks: [], notes: [], books: [] }));
  }
  const db = JSON.parse(fs.readFileSync(DB_FILE));
  // Ensure keys exist
  if (!db.users) db.users = [];
  if (!db.groups) db.groups = [];
  if (!db.messages) db.messages = [];
  if (!db.timetables) db.timetables = [];
  if (!db.tasks) db.tasks = [];
  if (!db.notes) db.notes = [];
  if (!db.books) db.books = [];
  return db;
};

const saveDb = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

module.exports = { getDb, saveDb };
