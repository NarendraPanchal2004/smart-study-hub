const crypto = require('crypto');
global.crypto = crypto.webcrypto;
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Narendra:Narendra2004@cluster0.b3diuan.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  })
  .catch(console.error);
