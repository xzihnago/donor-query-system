import routeLog from "./routeLog";
import errorHandler from "./errorHandler";
import authentication from "./authentication";
import validateSchema from "./validateSchema";

const middleware = {
  routeLog,
  errorHandler,
  authentication,
  validateSchema,
};

export default middleware;
