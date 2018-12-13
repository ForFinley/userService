
function isAdmin(req, res, next) {
    console.log(req.user);
    if (req.user.role === "ADMIN") next();
    else res.status(401).json("unauthorized.");
}

module.exports = {
    isAdmin
}