const crypto = require('crypto');
global.crypto = crypto.webcrypto;

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Narendra:Narendra2004@cluster0.b3diuan.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => mongoose.connection.db.collection('users').updateOne({email: 'naru16p@gmail.com'}, {$set: {role: 'Admin'}}))
  .then(() => {
    console.log('Role updated!');
    process.exit(0);
  })
  .catch(console.error);
