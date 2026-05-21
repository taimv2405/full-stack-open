const mongoose = require('mongoose');

const argsLength = process.argv.length;

if (argsLength < 3) {
  console.log('Please give password as argument');
  process.exit(1);
}

if (argsLength === 4 || argsLength > 5) {
  console.log(
    'Please give both name and number as argument, use quote if name has spaces',
  );
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://taimv2405_db_user:${password}@cluster0.vgnad5m.mongodb.net/phonebook?appName=Cluster0`;

mongoose.set('strictQuery', false);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

mongoose
  .connect(url, { family: 4 })
  .then(() => {
    if (argsLength === 3) {
      console.log('phonebook:');

      return Person.find({}).then((persons) => {
        persons.forEach((person) =>
          console.log(`${person.name} ${person.number}`),
        );
      });
    }
    if (argsLength === 5) {
      const name = process.argv[3];
      const number = process.argv[4];

      const person = new Person({ name, number });

      return person.save().then(() => {
        console.log(
          `Added ${person.name} number ${person.number} to phonebook`,
        );
      });
    }
  })
  .catch((error) => console.error('Database operation failed', error.message))
  .finally(() => mongoose.connection.close());
