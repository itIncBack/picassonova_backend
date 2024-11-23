/*
  Warnings:

  - You are about to drop the column `user_id` on the `Confirmation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Confirmation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Confirmation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Confirmation" DROP CONSTRAINT "Confirmation_user_id_fkey";

-- AlterTable
ALTER TABLE "Confirmation" DROP COLUMN "user_id",
ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "device_id" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Confirmation_email_key" ON "Confirmation"("email");

-- AddForeignKey
ALTER TABLE "Confirmation" ADD CONSTRAINT "Confirmation_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
