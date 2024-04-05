const mongoose = require('mongoose')
const ResultSchemaDef = new mongoose.Schema({
    election_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Election',
        required: true,
        unique: true
    },
    positions: [
        {
            position: {
                type: String,
                required: true
            },
            winner: {
                type: mongoose.Types.ObjectId,
                ref: 'Candidate',
                required: true
            },
            candidates: [
                {
                    candidate: {
                        type: mongoose.Types.ObjectId,
                        ref: 'Candidate',
                        required: true
                    },
                    votes: {
                        type: Number,
                        default: 0,
                        required: true
                    }
                }
            ]
        }
    ]
}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true
});


const ResultModel = mongoose.model('Result', ResultSchemaDef);
module.exports = ResultModel;