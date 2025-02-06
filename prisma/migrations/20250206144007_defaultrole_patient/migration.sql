/*
  Warnings:

  - You are about to drop the column `specialtyId` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the `Specialty` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "doctors" DROP CONSTRAINT "doctors_specialtyId_fkey";

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "specialtyId";

-- DropTable
DROP TABLE "Specialty";
