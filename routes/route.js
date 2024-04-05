const express = require("express");
const app = express();

const auth_routes = require('./auth.route')
const user_routes = require("./user.routes");
const election_routes = require("./election.routes");
const candidate_routes = require("./candidate.routes");
const vote_routes = require("./vote.routes");

app.use('/user', user_routes);
app.use('/election', election_routes);
app.use('/candidate', candidate_routes);
app.use('/vote', vote_routes);

app.use('/auth',auth_routes); 


module.exports = app;