import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import * as middleware from "@dqs/middleware";
import * as openapi from "./openapi";
import * as schema from "./schemas";
import * as model from "./model";

const router = new Hono();

router.get(
  "/:name",
  openapi.sum,
  middleware.authentication,
  middleware.permission(middleware.PermissionBits.SEARCH),
  async (c) => {
    const data = await model.sumRecordByName(c.req.param("name"));
    if (!data) {
      throw new HTTPException(404, { message: c.req.param("name") });
    }

    return c.json(data);
  },
);

router.post(
  "/",
  openapi.upload,
  middleware.authentication,
  middleware.permission(middleware.PermissionBits.MANAGE_DATABASE),
  middleware.validator("json", schema.uploadSchema),
  async (c) => {
    const nameMap = new Proxy<Record<string, number[]>>(
      {},
      {
        get: (target, p: string) => (target[p] ??= []),
      },
    );
    const body = c.req.valid("json");
    body.forEach((record) => nameMap[record[0]].push(record[1]));

    const tasks = Object.entries(nameMap).map(model.uploadRecordByTuple);
    await Promise.all(tasks);

    return c.json(body.length);
  },
);

router.get(
  "/",
  openapi.list,
  middleware.authentication,
  middleware.permission(middleware.PermissionBits.MANAGE_DATABASE),
  async (c) => {
    const donors = await model.findAllDonorName();

    const tasks = donors.map(async ({ name }) => {
      const total = await model.sumRecordByName(name);
      return [name, total];
    });
    const data = await Promise.all(tasks);

    return c.json(data);
  },
);

export default router;
