/*
  Warnings:

  - You are about to drop the column `name` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `appointmentTypeId` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `AppointmentType` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AppointmentTypeEnum" AS ENUM ('GENERAL', 'SPECIALIST', 'FOLLOW_UP', 'EMERGENCY');

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_typeId_fkey";

-- AlterTable
ALTER TABLE "Action" DROP COLUMN "name",
ADD COLUMN     "appointmentTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "typeId";

-- AlterTable
ALTER TABLE "AppointmentType" DROP COLUMN "type",
ADD COLUMN     "type" "AppointmentTypeEnum" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentType_type_key" ON "AppointmentType"("type");

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_appointmentTypeId_fkey" FOREIGN KEY ("appointmentTypeId") REFERENCES "AppointmentType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
