const mongoose = require('mongoose');

const CandidateSchemaDef = new mongoose.Schema({
    candidate:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    organization:{
        type: String,
        required: false
    },
    position:{
        type: String,
        required: true
    },
    election_id:{
        type: mongoose.Types.ObjectId,
        ref: 'Election',
        required: true
    },
    slug:{
        type: String,
        required: true,
    },
    manifesto:{
        type: String,
        required: false
    }
},{
    timestamps: true,
    autoCreate: true,
    autoIndex: true
});

const CandidateModel = mongoose.model('Candidate', CandidateSchemaDef);
module.exports = CandidateModel;