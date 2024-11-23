import jsonwebtoken from "jsonwebtoken";

export const jwt: Middleware<[secret: string]> =
  (secret) => (req, res, next) => {
    const token =
      req.headers.authorization?.split(" ")[1] ??
      (req.signedCookies as { token: string } | undefined)?.token;

    if (!token) {
      res.status(401);
      next(new Error("No authorization header or cookie"));
      return;
    }

    try {
      const decoded = jsonwebtoken.verify(token, secret);
      req.jwt = {
        token,
        decoded,
      };
    } catch (error) {
      res.status(401);
      next(error);
      return;
    }

    next();
  };

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      jwt: {
        token: string;
        decoded: string | jsonwebtoken.JwtPayload;
      };
    }
  }
}
