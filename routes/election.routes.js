const router = require('express').Router();
const ElectionController = require('../app/controller/election.controller');
const loginCheck = require("../app/middleware/auth.middleware");
const {isAdmin} = require("../app/middleware/rbac.middleware");
const uploader = require("../app/middleware/file-upload.middleware");

const electionController = new ElectionController();
const setDestination = (req, res, next) => {
    req.dest = "election",
    next();
}


router.post('/add',loginCheck,isAdmin,setDestination, uploader.array('images'),electionController.addElection);
router.get('/all', electionController.getAllElections);
router.get('/get-slug/:slug', electionController.getElectionBySlug);
router.put('/update/:slug', loginCheck,isAdmin,electionController.updateElectionBySlug);
router.delete('/delete/:slug',loginCheck, electionController.deleteElectionBySlug);
router.delete('/deletebyid/:id',loginCheck, electionController.deleteElectionById);


router.get('/get/:id', electionController.getElectionById);

//results
router.get('/calculate-result/:id',loginCheck,isAdmin, electionController.calculateElectionResult);
router.get('/result/:id', electionController.getElectionResult);
router.get('/result',electionController.getAllResults)

module.exports = router;