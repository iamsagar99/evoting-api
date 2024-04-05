const mongoose = require('mongoose');

const ParentSchemaDef = new mongoose.Schema({
    parent:{
        type: String,
        enum:['father','mother'],
        default:'father'
    },
    pname: {
        type: String,
        required: false
    }
    
})

const UserSchemaDef = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin','user'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active','inactive'],
        default: 'active'
    },
    phone:{
        type: String,
        required: true,
        unique: true
    },
    organization:{
        type: String,
        enum: ['governmental','non-governmental'],
        default: 'non-governmental'
    },
    dob:{
        type: Date,
        required: true
    },
    parent: {
        type: String,
        required: false
    },
    image:{
        type: String,
        required: false
    }
},{
    timestamps: true,
    autoCreate: true,
    autoIndex: true
});

const UserModel = mongoose.model('User', UserSchemaDef);
module.exports = UserModel;