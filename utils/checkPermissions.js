const UnAuthenticatedError = require("../errors/unauthenticated");

const checkPermissions = (requestUser, resourceId) => {
  if (
    requestUser.userId === resourceId.toString() ||
    requestUser.isAdmin === true
  )
    return;

  throw new UnAuthenticatedError("Not authorized to access this route");
  return;
};

module.exports = checkPermissions;
