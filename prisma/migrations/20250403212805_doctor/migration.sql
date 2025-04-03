/*
  Warnings:

  - Added the required column `requiredSpecialty` to the `AppointmentType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialty` to the `doctors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AppointmentType" ADD COLUMN     "requiredSpecialty" "AppointmentTypeEnum" NOT NULL;

-- AlterTable
ALTER TABLE "doctors" ADD COLUMN     "specialty" "AppointmentTypeEnum" NOT NULL;
