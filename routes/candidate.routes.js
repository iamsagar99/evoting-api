const router = require('express').Router();
const {isAdmin} = require("../app/middleware/rbac.middleware");
const loginCheck = require("../app/middleware/auth.middleware");

const CandidateController = require('../app/controller/candidate.controller');
const candidateController = new CandidateController();


router.post('/add',loginCheck,isAdmin, candidateController.addCandidate);
router.get('/get', candidateController.getAllCandidates);
router.get('/get-slug/:slug', candidateController.getCandidatesBySlug);
router.put('/update/:slug',loginCheck,isAdmin, candidateController.updateCandidateBySlug);
router.delete('/delete-slug/:slug',loginCheck,isAdmin, candidateController.deleteCandidatesBySlug);
router.delete('/delete/:id',loginCheck,isAdmin, candidateController.deleteCandidateById);
router.get('/get/:id', candidateController.getCandidateById);
// query to get candidates by election_id
router.get('/get-by-election/:ename', candidateController.getCandidatesByElectionSlug);

module.exports = router;
