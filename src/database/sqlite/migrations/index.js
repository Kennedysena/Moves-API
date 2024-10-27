const sqliteConnection = require("../../sqlite");

const createUsers = require("./createUsers");

async function migrationsRun() {
  const schema = [createUsers].join(";");
  await sqliteConnection()
    .then((db) => db.exec(schema))
    .catch((error) => console.log(error));
}

module.exports = migrationsRun;
