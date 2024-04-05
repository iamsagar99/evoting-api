const ElectionModel = require('../models/election.model');
const VoteModel = require('../models/vote.model');
const ResultModel = require("../models/result.model")
const slugify = require('slugify');
const CandidateModel = require('../models/candidates.model');



class ElectionController {

    addElection = (req, res, next) => {
        let data = req.body;

        if (req.files) {
            let images = [];
            req.files.map((image) => {
                images.push(image.filename)
            })
            data.images = images;
        }


        try {
            data.slug = slugify(data.title.toLowerCase());
            if (data.voters) {
                data.voters = data.voters.split(",");
            }
            if (data.positions) {
                data.positions = data.positions.split(",");
            }

            let election = new ElectionModel(data)
            election.save()
                .then((response) => {
                    res.json({
                        result: election,
                        status: true,
                        msg: "Election created successfully."
                    })
                })
                .catch((error) => {
                    next({
                        status: 400,
                        msg: error
                    })
                })

        } catch (err) {
            next({
                status: 500,
                msg: err
            })
        }
    }

    getAllElections = async (req, res, next) => {
        try {
            let filters = {}
            if (req.query.status && req.query.status !== "all") {
                filters = {
                    status: req.query.status
                }
            }
            let data = await ElectionModel.find(filters);
            
            res.json({
                result: data,
                msg: "Fetched elections",
                status: true
            })
        } catch (error) {
            next(error)
        }
    }

    updateElectionBySlug = async (req, res, next) => {
        let data = req.body;
        if (req.file) {
            data.image = req.file.filename
        }
        try {
            let ack = await ElectionModel.findOneAndUpdate({ slug: req.params.slug }, {
                $set: data
            });
            if (ack) {
                res.json({
                    status: true,
                    msg: "Election updated successfully.",
                    result: ack
                });
            } else {
                next({
                    status: 400,
                    msg: "Election not found."
                });
            }
        } catch (err) {
            next({
                status: 500,
                msg: err
            });
        }
    };

    deleteElectionBySlug = async (req, res, next) => {
        try {
            let ack = await ElectionModel.findOneAndDelete({ slug: req.params.slug });
            if (!ack) {
                res.json({
                    status: false,
                    msg: "Election not found."
                });
            } else {
                res.json({
                    status: true,
                    msg: "Election deleted successfully.",
                    result: ack
                });
            }
        } catch (err) {
            next({
                status: 500,
                msg: err
            });
        }
    };
    deleteElectionById = async (req, res, next) => {
        try {
            let ack = await ElectionModel.findOneAndDelete({ _id: req.params.id });
            if (!ack) {
                res.json({
                    status: false,
                    msg: "Election not found."
                });
            } else {
                res.json({
                    status: true,
                    msg: "Election deleted successfully.",
                    result: ack
                });
            }
        } catch (err) {
            next({
                status: 500,
                msg: err
            });
        }
    };
    getElectionById = async (req, res, next) => {
        try {
            let election = await ElectionModel.findById(req.params.id);
            if (!election) {
                res.json({
                    status: false,
                    msg: "Election not found."
                });
            } else {
                res.json({
                    status: true,
                    msg: "Election found.",
                    result: election
                });
            }
        } catch (err) {
            next({
                status: 500,
                msg: err
            });
        }
    };

    getElectionBySlug = async (req, res, next) => {
        try {
            let election = await ElectionModel.findOne({ slug: req.params.slug });
            if (!election) {
                res.json({
                    status: false,
                    msg: "Election not found."
                });
            } else {
                res.json({
                    status: true,
                    msg: "Election found.",
                    result: election
                });
            }
        } catch (err) {
            next({
                status: 500,
                msg: err
            });
        }
    };

    /*
        after election ends as present in database, calculate the election result as 
        - list all the position for particular election
        - calculate the total vote for each position
        - calculate the total vote for each candidate for each position
        - for the position declare the candidate
        - create a list of candidate for each position with their ranking 
        - assign the winning candidate for the position to winner entity.
        If there is more than one candidate having same vote count, then the candidate with the earliest vote will be declared as winner.
          If there is more than one candidate with same vote count and same earliest vote time, then the candidate with the lowest id will be declared as winner.
          If there are multiple candidates having same votes then the candidate with the earliest vote will be declared as winner.
        make a schema for the result model to store all the result of the election as mentioned above.
    */
    // calculateElectionResult = async (req, res, next) => {
    //     try {
    //         let election = await ElectionModel.findById(req.params.id);
    //         if (!election) {
    //             res.json({
    //                 status: false,
    //                 msg: "Election not found."
    //             });
    //         }
    //         //instead of checking for status, check for end date
    //         else if ((new Date()).getTime() < new Date(election.end_date).getTime()) {
    //             res.json({
    //                 status: false,
    //                 msg: "Election is not ended yet."
    //             });
    //         }
    //         // if already calculated then return the result of that election
    //         else if (await ResultModel.exists({ election_id: req.params.id })) {
    //             let result = await ResultModel.findOne({ election_id: req.params.id });
    //             res.json({
    //                 status: true,
    //                 result: result,
    //                 msg: "Election result already calculated."
    //             });
    //         }
    //         // otherwise calculate and save the result info
    //         else {
    //             let positions = election.positions;
    //             let result = [];
    //             for (let i = 0; i < positions.length; i++) {
    //                 let position = positions[i];
    //                 //election model doesnt contain candidates array so we need to fetch fetch candidate by election and go on from there
    //                 let candidates = await CandidateModel.find({ election_id: req.params.id });
    //                 //filter candidates by position
    //                 candidates = candidates.filter((candidate) => candidate.position === position);

    //                 //let candidates = election.candidates.filter((candidate) => candidate.position === position);
    //                 let positionResult = {
    //                     position: position,
    //                     candidates: []
    //                 }
    //                 for (let j = 0; j < candidates.length; j++) {
    //                     let candidate = candidates[j];
    //                     let votes = await VoteModel.find({ candidate_id: candidate._id });
    //                     let candidateResult = {
    //                         candidate: candidate,
    //                         votes: votes.length
    //                     }
    //                     positionResult.candidates.push(candidateResult);
    //                 }
    //                 positionResult.candidates.sort((a, b) => b.votes - a.votes);
    //                 positionResult.winner = positionResult.candidates[0];
    //                 result.push(positionResult);
    //             }

    //             const natija = new ResultModel({
    //                 election_id: election._id,
    //                 positions: result
    //             });
    //             await natija.save();


    //             natija && res.json({
    //                 status: true,
    //                 msg: "Election result calculated.",
    //                 result: result
    //             });
    //         }
    //     } catch (err) {
    //         next({
    //             status: 500,
    //             msg: err
    //         });
    //     }
    // };

    // calculateElectionResult = async (req, res, next) => {
    //     try {
    //         let election = await ElectionModel.findById(req.params.id);
    //         if (!election) {
    //             res.json({
    //                 status: false,
    //                 msg: "Election not found."
    //             });
    //             return;
    //         }

    //         // Check if the election has ended
    //         if (new Date() < new Date(election.end_date)) {
    //             res.json({
    //                 status: false,
    //                 msg: "Election is not ended yet."
    //             });
    //             return;
    //         }

    //         // Check if the result already exists
    //         if (await ResultModel.exists({ election_id: req.params.id })) {
    //             let result = await ResultModel.findOne({ election_id: req.params.id });
    //             res.json({
    //                 status: true,
    //                 result: result,
    //                 msg: "Election result already calculated."
    //             });
    //             return;
    //         }

    //         // Fetch all candidates for the election
    //         let candidates = await CandidateModel.find({ election_id: req.params.id });

    //         let positionsResult = [];
    //         for (let position of election.positions) {
    //             // Filter candidates for the current position
    //             let positionCandidates = candidates.filter(candidate => candidate.position === position);

    //             // Sort candidates by number of votes
    //             positionCandidates.sort((a, b) => b.votes - a.votes);

    //             // Store winner and candidates for the position
    //             let positionResult = {
    //                 position: position,
    //                 winner: positionCandidates[0]._id, // Assuming the first candidate is the winner
    //                 candidates: positionCandidates.map(candidate => ({
    //                     candidate: candidate._id,
    //                     votes: candidate.votes // Correcting this line to use actual vote count
    //                 }))
    //             };

    //             positionsResult.push(positionResult);
    //         }

    //         // Create and save the result
    //         const result = new ResultModel({
    //             election_id: election._id,
    //             positions: positionsResult
    //         });
    //         await result.save();

    //         res.json({
    //             status: true,
    //             msg: "Election result calculated.",
    //             result: result
    //         });
    //     } catch (err) {
    //         next({
    //             status: 500,
    //             msg: err
    //         });
    //     }
    // };

    calculateElectionResult = async (req, res, next) => {
        try {
            let election = await ElectionModel.findById(req.params.id);
            if (!election) {
                res.json({
                    status: false,
                    msg: "Election not found."
                });
                return;
            }

            // Check if the election has ended
            if (new Date() < new Date(election.end_date)) {
                res.json({
                    status: false,
                    msg: "Election is not ended yet."
                });
                return;
            }

            // Check if the result already exists
            if (await ResultModel.exists({ election_id: req.params.id })) {
                let result = await ResultModel.findOne({ election_id: req.params.id });
                res.json({
                    status: true,
                    result: result,
                    msg: "Election result already calculated."
                });
                return;
            }

            // Fetch all candidates for the election
            let candidates = await CandidateModel.find({ election_id: req.params.id });

            let positionsResult = [];
            for (let position of election.positions) {
                // Filter candidates for the current position
                let positionCandidates = candidates.filter(candidate => candidate.position === position);

                // Count votes for each candidate in this position
                let candidateVoteCounts = {};
                for (let candidate of positionCandidates) {
                    let voteCount = await VoteModel.countDocuments({ candidate_id: candidate._id });
                    candidateVoteCounts[candidate._id] = voteCount;
                    // console.log("candi",candidate._id,"vote",voteCount)

                }

                // Sort candidates by vote count
                positionCandidates.sort((a, b) => candidateVoteCounts[b._id] - candidateVoteCounts[a._id]);

                // Store winner and candidates for the position
                let positionResult = {
                    position: position,
                    winner: positionCandidates[0]._id, // Assuming the first candidate is the winner
                    candidates: positionCandidates.map(candidate => ({
                        candidate: candidate._id,
                        votes: candidateVoteCounts[candidate._id] // Use actual vote count
                    }))
                };

                positionsResult.push(positionResult);
            }

            // Create and save the result
            const result = new ResultModel({
                election_id: election._id,
                positions: positionsResult
            });
            await result.save();

            res.json({
                status: true,
                msg: "Election result calculated.",
                result: result
            });
        } catch (err) {
            next({
                status: 500,
                msg: err
            });
        }
    };




    getElectionResult = async (req, res, next) => {
        try {
            console.log("here")
            let result = await ResultModel.findOne({ election_id: req.params.id })  
            .populate({
                path: 'election_id',
                select: '_id title start_date end_date images'
            })
            .populate({
                path: 'positions.winner',
                select: '_id name candidate organization',
                populate: {
                    path: 'candidate',
                    select: '_id name image organization'
                }
            })
            .populate({
                path: 'positions.candidates.candidate',
                select: '_id name candidate organization',
                populate: {
                    path: 'candidate',
                    select: '_id name image'
                }
            });
            if (!result) {
                res.json({
                    result: null,
                    status: false,
                    msg: "Result not found."
                });
            } else {
                res.json({
                    status: true,
                    msg: "Result found.",
                    result: result
                });
            }
        } catch (err) {
            next({
                status: 500,
                msg: err
            });
        }
    }

    // write a function to get the all the result in result database
    getAllResults = async (req, res, next) => {
        try {
            let results = await ResultModel.find()
                .populate({
                    path: 'election_id',
                    select: '_id title start_date end_date'
                })
                .populate({
                    path: 'positions.winner',
                    select: '_id name candidate',
                    populate: {
                        path: 'candidate',
                        select: '_id name'
                    }
                })
                .populate({
                    path: 'positions.candidates.candidate',
                    select: '_id name candidate',
                    populate: {
                        path: 'candidate',
                        select: '_id name'
                    }
                });

            res.json({
                status: true,
                msg: "Fetched all results.",
                result: results
            });
        } catch (err) {
            next({
                status: 500,
                msg: err
            });
        }
    }

}



module.exports = ElectionController;

/**


write dummy data for the election, candidate and vote model and test the above function as compatible to test for postman


 */
// const postman = {
//     "title": "Election 1",
//     "description": "Election 1 description",
//     "start_date": "2021-09-01",
//     "end_date": "2021-09-30",
//     "voters": "6135d0c1b3f4e3d3d8a4e3d3,6135d0c1b3f4e3d3d8a4e3d4",
//     "positions": "President,Vice President",
//     "status": "active"
// };

