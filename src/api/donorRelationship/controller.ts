import { z } from "zod";
import { updateDonorRelationValidate } from "./validates";

export const updateDonorRelationship = async (
  data: z.infer<typeof updateDonorRelationValidate>
) => {
  const donor = await prisma.donor.upsert({
    where: { name: data.name },
    update: {},
    create: { name: data.name },
  });

  await Promise.all(
    data.relations.map((name) =>
      prisma.donor.upsert({
        where: { name },
        update: {
          chiefId: donor.id,
        },
        create: { name, chiefId: donor.id },
      })
    )
  );

  return `已更新「${data.relations.join("、")}」的關聯至「${data.name}」`;
};
