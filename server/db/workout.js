const moment = require('moment');
const db = require('./db');

const fields = {
  id: 'int',
  name: 'string',
  reps: 'int',
  weight: 'int',
  date: 'date',
  lbs: 'bool'
};

function validate(field, value) {
  if (value === undefined) {
    throw `Field ${field} is missing a value`;
  }

  let val;
  switch (fields[field]) {
    case 'string':
      if (value.length < 1) {
        throw `Field "${field}" is empty; value required`;
      }
      return value;
    case 'int':
      val = parseInt(value);
      if (val === NaN) {
        throw `Field "${field}" is not a valid integer`;
      }
      return val;
    case 'date':
      val = moment.utc(value);
      if (!val.isValid()) {
        throw `Field "${field}" is not a valid ISO8601-formatted date`;
      }
      return val.format('YYYY-MM-DD');
    case 'bool':
      val = Boolean(value);
      return val;
    default:
      throw `Field "${field}" does not have a validation type set`;
  }
}

function list() {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM workouts ORDER BY id DESC;', (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

function insert(data) {
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?);',
      [data.name, data.reps, data.weight, data.date, data.lbs],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      }
    );
  });
}

function update(id, data) {
  return new Promise((resolve, reject) => {
    db.query(
      'UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?',
      [data.name, data.reps, data.weight, data.date, data.lbs, id],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      }
    );
  });
}

function del(id) {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM workouts WHERE id=?', [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

function reset() {
  return new Promise((resolve, reject) => {
    db.query('DROP TABLE IF EXISTS workouts;', (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      db.query(
        `
                CREATE TABLE workouts(
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    name VARCHAR(255) NOT NULL,
                    reps INT,
                    weight INT,
                    date DATE,
                    lbs BOOLEAN
                );
            `,
        err => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        }
      );
    });
  });
}

module.exports.list = list;
module.exports.insert = insert;
module.exports.update = update;
module.exports.delete = del;
module.exports.reset = reset;
module.exports.validate = validate;
