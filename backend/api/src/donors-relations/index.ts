import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import * as middleware from "@dqs/middleware";
import * as openapi from "./openapi";
import * as schema from "./schemas";
import * as model from "./model";

const router = new Hono();

router.get(
  "/:name",
  openapi.get,
  middleware.authentication,
  middleware.permission(middleware.PermissionBits.EDIT_RELATION),
  async (c) => {
    const data = await model.findRelationsByName(c.req.param("name"));
    if (!data) {
      throw new HTTPException(404, { message: c.req.param("name") });
    }

    const result = data.map((donor) => [donor.superior?.name, donor.name]);

    return c.json(result);
  },
);

router.put(
  "/:name",
  openapi.update,
  middleware.authentication,
  middleware.permission(middleware.PermissionBits.EDIT_RELATION),
  middleware.validator("json", schema.updateSchema),
  async (c) => {
    const inferior = await model.findDonorByName(c.req.param("name"));
    if (!inferior) {
      throw new HTTPException(404, { message: c.req.param("name") });
    }

    const body = c.req.valid("json");

    let superiorId = null;
    if (body.superior) {
      const superior = await model.findDonorByName(body.superior);
      if (!superior) {
        throw new HTTPException(404, { message: body.superior });
      }

      superiorId = superior.id;
    }

    await model.updateRelationsByName(inferior.name, superiorId);

    return c.body("");
  },
);

export default router;
