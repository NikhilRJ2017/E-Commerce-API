const { UnauthorizeError } = require("../errors");

//* For users: we are restricting the users from viewing other user's details using getSingleUser, for admin it is allowed. User can still see their own details
const checkPermissions = (requestUser, resourceUserId)=>{
    // console.log(requestUser);
    // console.log(resourceUserId);
    // console.log(typeof resourceUserId);

    //? admin is allowed
    if(requestUser.role === 'admin'){
        return;
    }

    //? User seeing their own details is allowed
    if(requestUser.userId === resourceUserId.toString()){
        return;
    }

    //?user can't see other user's details
    throw new UnauthorizeError("Not authorized to access this route");
}

module.exports = checkPermissions;