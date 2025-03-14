/* eslint-disable no-var */
import { prisma as _prisma } from "./prisma";

declare global {
  var prisma: typeof _prisma;
}

global.prisma = _prisma;
