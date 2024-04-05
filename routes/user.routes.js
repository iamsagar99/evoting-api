const router = require('express').Router();
const loginCheck = require("../app/middleware/auth.middleware");
const {isAdmin, isSelfUserOrAdmin} = require("../app/middleware/rbac.middleware")
const uploader = require("../app/middleware/file-upload.middleware");

const UserController = require("../app/controller/user.controller");
let user_obj = new UserController();

let setDestination = (req, res, next) => {
    req.dest = "user"; 
    next()
}

router.route('/')
    .get(loginCheck, isAdmin, user_obj.getAllUsers);

router.route('/:id')
    .put(
        loginCheck,
        isSelfUserOrAdmin,
        setDestination,
        uploader.single('image'),
        user_obj.updateUserById
        )

        .delete(
        loginCheck,
        isAdmin,
        user_obj.deleteUserById
        )

        .get(user_obj.getUserById)

module.exports = router;