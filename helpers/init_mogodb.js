const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
  dbName: process.env.DB_NAME,
})
  .then(() => {
    console.log('MongoDB connected.');
  })
  .catch((err) => {
    console.error('Connection error:', err);
  });

mongoose.connection.on('connected', () => {
  console.log('mongoose is connected to database')
})

mongoose.connection.on('error', (err) => {
  console.log(err.message)
})

mongoose.connection.on('disconnecting', () => {
  console.log('Database is disconnected')
})

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0)
})