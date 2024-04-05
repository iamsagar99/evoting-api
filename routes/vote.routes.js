const router = require('express').Router();

const VoteController = require('../app/controller/vote.controller');
const loginCheck = require("../app/middleware/auth.middleware");
const validVote = require("../app/middleware/vote.middleware");

const Crypto = require('../app/services/cryptography.service');
const crypto_svc = new Crypto();

const voteController = new VoteController();

router.post('/add',loginCheck,validVote, voteController.addVote);
router.get('/my-votes', loginCheck, voteController.getMyVotes);
router.get('/all', voteController.getVotes);
router.get('/get/:id', voteController.getElectionVotes);// eid


router.post('/checkenc',loginCheck,validVote,voteController.addVote)

module.exports = router;
