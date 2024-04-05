const router = require("express").Router();
const AuthController= require("../app/controller/auth.controller");
const loginCheck = require("../app/middleware/auth.middleware");
const uploader = require("../app/middleware/file-upload.middleware")


const auth_ctrl = new AuthController();

let setDestination = (req, res, next) => {
    req.dest = "user"; 
    next()
}
// http://localhost:9001/api/v1/register
router.post("/register",
    setDestination,  
    uploader.single('image'),
    auth_ctrl.register
)
router.post('/login', auth_ctrl.login)

router.get("/login-verify",loginCheck,auth_ctrl.verifyUser);


module.exports = router;