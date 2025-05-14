/* eslint-disable no-var */
import * as _env from "./env";
import { prisma as _prisma } from "./prisma";

declare global {
  var env: typeof _env;
  var prisma: typeof _prisma;
}

global.env = _env;
global.prisma = _prisma;
