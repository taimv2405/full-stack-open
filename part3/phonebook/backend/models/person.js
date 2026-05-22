const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('Connecting to MongoDB');
mongoose
  .connect(url, { family: 4 })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Database operation failed', error.message));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    trim: true,
  },
  number: {
    type: String,
    validate: {
      validator: (v) => /^\d{2,3}-\d+$/.test(v),
      message: '{VALUE} is not a valid phone number!',
    },
    minLength: 8,
    required: true,
    trim: true,
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
