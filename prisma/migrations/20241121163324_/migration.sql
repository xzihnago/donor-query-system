/*
  Warnings:

  - You are about to drop the `DonorRelationship` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DonorRelationship" DROP CONSTRAINT "DonorRelationship_donorId_fkey";

-- AlterTable
ALTER TABLE "Donor" ADD COLUMN     "chiefId" TEXT;

-- DropTable
DROP TABLE "DonorRelationship";

-- AddForeignKey
ALTER TABLE "Donor" ADD CONSTRAINT "Donor_chiefId_fkey" FOREIGN KEY ("chiefId") REFERENCES "Donor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
