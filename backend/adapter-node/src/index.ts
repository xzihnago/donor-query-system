import "dotenv/config";
import { serve } from "@hono/node-server";
import app from "@dqs/server";

serve(app);
