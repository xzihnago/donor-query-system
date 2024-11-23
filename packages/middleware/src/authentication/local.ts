export const local: Middleware = (req, res, next) => {
  const remote = req.ip ?? req.socket.remoteAddress;

  if (remote !== "::1" && remote !== "localhost") {
    res.status(401);
    next(new Error("Unauthorized"));
    return;
  }

  next();
};
