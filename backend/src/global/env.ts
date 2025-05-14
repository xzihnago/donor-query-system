import "dotenv/config";

if (!process.env.PORT) {
  throw new Error("Missing env var: PORT");
}
export const PORT = process.env.PORT;

if (!process.env.JWT_SECRET) {
  throw new Error("Missing env var: JWT_SECRET");
}
export const JWT_SECRET = process.env.JWT_SECRET;
