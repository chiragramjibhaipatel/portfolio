/*
  Warnings:

  - A unique constraint covering the columns `[xata_id]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
ADD COLUMN     "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "xata_version" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Project__pgroll_new_xata_id_key" ON "Project"("xata_id");
