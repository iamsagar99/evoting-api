const mongoose = require('mongoose');

const ElectionSchemaDef = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    slug:{
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['active','inactive'],
        default: 'active'
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    voters:[{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: null
    }],
    images:[{
        type: String,
        required: false
    }],
    positions:[{
        type: String,
        required: true
    }],
    
    },{
    timestamps: true,
    autoCreate: true,
    autoIndex: true
});


const ElectionModel = mongoose.model('Election', ElectionSchemaDef);
module.exports = ElectionModel;