const mongoose = require('mongoose')

const VoteSchemaDef = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    election_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Election',
        required: true
    },
    position:{
        type: String,
        required: true
    },
    candidate_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Candidate',
        required: true
    },
}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true
});

const VoteModel = mongoose.model('Vote', VoteSchemaDef);
module.exports = VoteModel;
