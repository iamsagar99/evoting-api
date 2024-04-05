const mongoose = require('mongoose');
const dbURL = process.env.dbURL || 'mongodb+srv://iamsagar099:9zrysBj4EnfCgr4i@cluster0.hwknlay.mongodb.net/evoting';

mongoose.connect(dbURL, {
    autoCreate: true,
    autoIndex: true
})
    .then(() => console.log("DB connected successfully."))
    .catch((err) => console.log("Error connecting to MongoDB", err));
