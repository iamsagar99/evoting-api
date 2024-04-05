const CandidateModel = require('../models/candidates.model');
const ElectionModel = require('../models/election.model');
const UserModel = require('../models/user.model');
const slugify = require('slugify');

class CandidateController {
    addCandidate = async (req, res, next) => {
        try {
            let data = req.body;
            console.log(data)
            let username = await UserModel.findOne({ _id: data.candidate });
            let electionname = await ElectionModel.findOne({ _id: data.election_id });
            data.slug = `${electionname.slug}-${slugify(username.name.toLowerCase())}`

            console.log(data)


            let candidate = new CandidateModel(data);
            candidate.save()
                .then((response) => {
                    res.json({
                        result: candidate,
                        status: true,
                        msg: "Candidate added successfully."
                    })
                })
                .catch((error) => {
                    next({
                        status: 400,
                        msg: error
                    })
                })
        } catch (err) {
            next(err);
        }
    }

    getAllCandidates = async (req, res, next) => {
        try {
            let filters = {}
            if (req.query.election_id) {
                filters = {
                    election_id: req.query.election_id
                }
            }

            const data = await CandidateModel.find(filters)
                .populate('election_id', '_id title')  
                .populate('candidate', 'name email phone dob image');
            res.json({
                result: data,
                status: true,
                msg: "Candidates fetched successfully."
            })
        } catch (err) {
            next(err);
        }
    }

    getCandidatesBySlug = async (req, res, next) => {
        try {
            let data = await CandidateModel.find({ slug: req.params.slug }).populate('election_id', '_id title')  
                .populate('candidate', 'name email phone dob image');
            res.json({
                result: data,
                status: true,
                msg: "Candidates fetched successfully."
            })
        } catch (err) {
            next(err);
        }
    }
    getCandidateById = async (req, res, next) => {
        const id = req.params.id
        try {
            let data = await CandidateModel.findById(id).populate('election_id', '_id title')  
                .populate('candidate', 'name email phone dob image');
            res.json({
                result: data,
                status: true,
                msg: "Candidates fetched successfully."
            })
        } catch (err) {
            next(err);
        }
    }

    updateCandidateBySlug = async (req, res, next) => {
        try {
            let data = req.body;
            let ack = await CandidateModel.findOneAndUpdate({ slug: req.params.slug }, { $set: data });
            if (ack) {
                res.json({
                    status: true,
                    msg: "Candidate updated successfully.",
                    result: ack
                });
            } else {
                next({
                    status: 400,
                    msg: "Candidate not found."
                });
            }
        } catch (err) {
            next(err);
        }
    }

    deleteCandidatesBySlug = async (req, res, next) => {
        try {
            let ack = await CandidateModel.findOneAndDelete({ slug: req.params.slug });
            if (ack) {
                res.json({
                    status: true,
                    msg: "Candidate deleted successfully.",
                    result: ack
                });
            } else {
                next({
                    status: 400,
                    msg: "Candidate not found."
                });
            }
        } catch (err) {
            next(err);
        }
    }

    deleteCandidateById = async (req, res, next) => {
        try {
            let ack = await CandidateModel.findByIdAndDelete(req.params.id);
            if (ack) {
                res.json({
                    status: true,
                    msg: "Candidate deleted successfully.",
                    result: ack
                });
            } else {
                next({
                    status: 400,
                    msg: "Candidate not found."
                });
            }
        } catch (err) {
            next(err);
        }
    }

    getCandidatesByElectionSlug = async (req, res, next) => {
        try {
            // Build a regular expression to match the slug containing req.params.ename
            const ename = req.params.ename;
            const regex = new RegExp(ename, 'i'); // 'i' for case-insensitive match

            // Query the CandidateModel using the regex
            const candidates = await CandidateModel.find({ slug: { $regex: regex } }).populate('election_id', '_id title')  
                .populate('candidate', 'name email phone dob image');

            // Check if any candidates are found
            if (candidates.length === 0) {
                 res.json({
                    status: false,
                    msg: `No candidates found for election ${ename}`

                });
            }

            // Return the found candidates
            res.json({
                status: true,
                msg: `Candidates found for election ${ename}`,
                result: candidates

            });
        } catch (error) {
            next(error);
        }
    };

    //get candidate by election id
    getCandidatesByElectionId = async (req, res, next) => {
        try {
            let election_id = req.params.id;
            let candidates = await CandidateModel.find({ election_id: election_id }).populate('election_id', '_id title')  
                .populate('candidate', 'name email phone dob image');
            res.json({
                status: true,
                msg: `Candidates found for election id ${election_id}`,
                result: candidates
            });
        } catch (error) {
            next(error);
        }
    };

}

module.exports = CandidateController;