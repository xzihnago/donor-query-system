const routeLog: Middleware = (req, _, next) => {
  const time = new Date().toISOString();
  const remote = req.ip ?? req.socket.remoteAddress ?? "unknown";

  console.log(
    `\x1b[0;36m[${time}] \x1b[0;35m[${remote}] \x1b[0;33m${req.method} \x1b[0m${req.path}`
  );

  next();
};

export default routeLog;
