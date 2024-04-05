const isAdmin = (req, res, next) => {
    let role = req.auth_user.role;
    if (role.includes('admin')) {
        next();
    } else {
        next({
            status: 403,
            msg: "Unauthorized"
        })
    }
}


const isUser = (req, res, next) => {
    let role = req.auth_user.role;
    const accept = ['user', 'admin'];
    if (accept.includes(role)) {
        next();
    } else {
        next({
            status: 403,
            msg: "Unauthorized"
        });
    }
};

const isSelfUserOrAdmin = (req, res, next) => {
    let user_id = req.auth_user.id;
    let id = req.params.id;
    if (user_id == id) {
        console.log("verified")
        next();
    } else if (req.auth_user.role.includes('admin')) {
        next();
    }
    else {
        next({
            status: 403,
            msg: "Unauthorized"
        })
    }
}

module.exports = {
    isAdmin,
    isUser,
    isSelfUserOrAdmin
}