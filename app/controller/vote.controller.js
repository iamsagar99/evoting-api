const VoteModel = require('./../models/vote.model');
const CryptService = require('./../services/cryptography.service');
const ElectionModel = require('../models/election.model');

class VoteController {
    constructor() {
        this.crypt_svc = new CryptService();
    }
    // addVote = async (req, res, next) => {
    //     try {
    //         let data = req.body;
    //         console.log("data-rec",data)
          
    //         let hashUser = this.crypt_svc.customHash(data.user);
    //         const election = await ElectionModel.findOne({ _id: data.election_id, voters: data.user });
    //         const voted = await VoteModel.findOne({user:hashUser, election_id: data.election_id, position: data.position});
    //         if (!election) {
    //             return next({
    //                 status: 400,
    //                 msg: "You are not allowed to vote in this election."
    //             })
    //         } else if(voted){
    //             return next({
    //                 status: 400,
    //                 msg: "You have already voted for this position."
    //             })
    //         }
            
    //         else {
    //            data.user = hashUser;
    //             let vote = new VoteModel(data);
    //             vote.save()
    //                 .then((response) => {
    //                     res.json({
    //                         result: vote,
    //                         status: true,
    //                         msg: "Vote added successfully."
    //                     })
    //                 })
    //                 .catch((error) => {
    //                     next({
    //                         status: 400,
    //                         msg: error
    //                     })
    //                 })
    //         }



    //     } catch (err) {
    //         next(err);
    //     }
    // }
    addVote = async (req, res, next) => {
        try {
            let data = req.body;
            console.log("data-rec", data);
            let messages = [];
    
            // Validate data format
            if (!data.votes || !Array.isArray(data.votes)) {
                messages.push("Invalid request format: 'votes' field must be an array.");
                return res.status(400).json({
                    status: 400,
                    msg: "Invalid request format: 'votes' field must be an array."
                });
            }
    
            let notAllowedMsg = null; // Variable to store the message for not allowed to vote
    
            // Process each vote
            const votesPromises = data.votes.map(async (vote) => {
                let hashUser = this.crypt_svc.customHash(req.auth_user._id);
                const election = await ElectionModel.findOne({ _id: data.election_id, voters: data.user });
                const voted = await VoteModel.findOne({ user: hashUser, election_id: data.election_id, position: vote.position });
                
                if (!election) {
                    notAllowedMsg = "You are not allowed to vote in this election.";
                    messages.push(notAllowedMsg);
                    return null; // Return null to indicate a failed vote
                } else if (voted) {
                    messages.push("You have already voted for this position.")
                    return {
                        status: 400,
                        msg: "You have already voted for this position."
                        
                    
                    };
                } else {
                    // Modify vote object to include hashed user
                    vote.user = hashUser;
                    vote.election_id =  data.election_id
                    
                    // Create new vote model
                    let newVote = new VoteModel(vote);
                    // Save vote
                    return newVote.save();
                }
            });
    
            // Execute all vote promises
            const votesResults = await Promise.all(votesPromises);
    
            // Handle results
            const successfulVotes = votesResults.filter(result => result && !result.status);
            const failedVotes = votesResults.filter(result => result && result.status);
    
            // Respond with results
            if (notAllowedMsg) {
                return res.status(400).json({
                    status: 400,
                    msg: notAllowedMsg
                });
            } else {
                if(failedVotes.length > 0){
                    messages.push("Some votes failed to save.")
                }else{
                    messages.push("Votes added successfully.")
                }
                return res.json({
                    result: successfulVotes,
                    status: true,
                    msg: messages,
                });
            }
        } catch (err) {
            next(err);
        }
    };
    
    

    getMyVotes = (req, res, next) => {
        try {
            let user = this.crypt_svc.decrypt(req.user._id);
            VoteModel.find({ user: user })
                .populate('election_id')
                .populate('candidate_id')
                .then((response) => {
                    res.json({
                        result: response,
                        status: true,
                        msg: "Votes fetched successfully."
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

    getVotes = (req, res, next) => {
        try {
            VoteModel.find()
                .populate('election_id')
                .populate('candidate_id')
                .then((response) => {
                    res.json({
                        result: response,
                        status: true,
                        msg: "Votes fetched successfully."
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

    /*get all votes for a particular election with vote count for each candidate in format: 
    
    {
        election_id: "election_id",
        candidates: [
            {
                candidate_id: "candidate_id",
                count: 0
            }
        ]
    }

    */
    getElectionVotes = (req, res, next) => {
        try {
            let election_id = req.params.id;
            VoteModel.aggregate([
                {
                    $match: {
                        election_id: mongoose.Types.ObjectId(election_id)
                    }
                },
                {
                    $group: {
                        _id: "$candidate_id",
                        count: {
                            $sum: 1
                        }
                    }
                }
            ])
                .then((response) => {
                    res.json({
                        result: response,
                        status: true,
                        msg: "Votes fetched successfully."
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



}

module.exports = VoteController;