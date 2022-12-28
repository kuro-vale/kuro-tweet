/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Heart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Retweet` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Heart" ADD COLUMN     "id" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Retweet" ADD COLUMN     "id" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Heart_id_key" ON "Heart"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Retweet_id_key" ON "Retweet"("id");
