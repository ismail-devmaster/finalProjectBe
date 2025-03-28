/*
  Warnings:

  - You are about to drop the column `assigneeId` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_assigneeId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "assigneeId";

-- CreateTable
CREATE TABLE "_TaskAssignees" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TaskAssignees_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TaskAssignees_B_index" ON "_TaskAssignees"("B");

-- AddForeignKey
ALTER TABLE "_TaskAssignees" ADD CONSTRAINT "_TaskAssignees_A_fkey" FOREIGN KEY ("A") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskAssignees" ADD CONSTRAINT "_TaskAssignees_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
