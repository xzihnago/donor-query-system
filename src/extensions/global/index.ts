/* eslint-disable no-var */
import type { PrismaClient } from "@prisma/client";
import prisma from "./prisma";

declare global {
  var prisma: PrismaClient;
}

global.prisma = prisma;
