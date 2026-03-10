import type { Env } from "@dqs/common";
import { env } from "hono/adapter";
import { createMiddleware } from "hono/factory";
import { prisma } from "@dqs/database";

export const logger = createMiddleware<Env>(async (c, next) => {
  const start = Date.now();
  await next();
  const delta = Date.now() - start;

  if (env(c).DEBUG) {
    const coloredTime = `${AnsiColor.FAINT}${new Date().toISOString()}${AnsiColor.RESET}`;
    const coloredMethod = colorMethod(c.req.method);
    const coloredStatus = colorStatus(c.res.status);
    const coloredDuration = `${AnsiColor.FAINT}${String(delta).padStart(5)}ms${AnsiColor.RESET}`;

    console.log(
      coloredTime,
      coloredMethod,
      coloredStatus,
      coloredDuration,
      c.req.path,
    );
  }

  void prisma.log
    .create({
      data: {
        method: c.req.method as never,
        status: c.res.status,
        duration: delta,
        path: c.req.path,
        ip:
          c.req.header("cf-connecting-ip") ??
          c.req.header("x-forwarded-for") ??
          "unknown",
      },
    })
    .catch((err: unknown) => {
      console.error(err);
    });
});

const colorMethod = (method: string) => {
  const colors = {
    GET: AnsiColor.GREEN,
    POST: AnsiColor.YELLOW,
    PUT: AnsiColor.CYAN,
    PATCH: AnsiColor.BRIGHT_MAGENTA,
    DELETE: AnsiColor.RED,
    HEAD: AnsiColor.GREEN,
    OPTIONS: AnsiColor.MAGENTA,
  };

  return `${colors[method as keyof typeof colors]}${method.padEnd(7)}${AnsiColor.RESET}`;
};

const colorStatus = (status: number) => {
  switch ((status / 100) | 0) {
    case 2:
      return `${AnsiColor.GREEN}${String(status)}${AnsiColor.RESET}`;
    case 3:
      return `${AnsiColor.CYAN}${String(status)}${AnsiColor.RESET}`;
    case 4:
      return `${AnsiColor.YELLOW}${String(status)}${AnsiColor.RESET}`;
    case 5:
      return `${AnsiColor.RED}${String(status)}${AnsiColor.RESET}`;
    default:
      return String(status);
  }
};

enum AnsiColor {
  RESET = "\x1b[0m",
  FAINT = "\x1b[2m",
  RED = "\x1b[31m",
  GREEN = "\x1b[32m",
  YELLOW = "\x1b[33m",
  MAGENTA = "\x1b[35m",
  CYAN = "\x1b[36m",
  BRIGHT_MAGENTA = "\x1b[95m",
}
