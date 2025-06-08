/*
  Warnings:

  - You are about to drop the column `createdAt` on the `UserDrug` table. All the data in the column will be lost.
  - You are about to drop the column `drugId` on the `UserDrug` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `UserDrug` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `UserDrug` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserDrug` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserDrug` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,drug_id]` on the table `UserDrug` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `drug_id` to the `UserDrug` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `UserDrug` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `UserDrug` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserDrug" DROP CONSTRAINT "UserDrug_drugId_fkey";

-- DropForeignKey
ALTER TABLE "UserDrug" DROP CONSTRAINT "UserDrug_userId_fkey";

-- DropIndex
DROP INDEX "UserDrug_userId_drugId_key";

-- AlterTable
ALTER TABLE "UserDrug" DROP COLUMN "createdAt",
DROP COLUMN "drugId",
DROP COLUMN "endDate",
DROP COLUMN "startDate",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "drug_id" INTEGER NOT NULL,
ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserDrug_user_id_drug_id_key" ON "UserDrug"("user_id", "drug_id");

-- AddForeignKey
ALTER TABLE "UserDrug" ADD CONSTRAINT "UserDrug_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDrug" ADD CONSTRAINT "UserDrug_drug_id_fkey" FOREIGN KEY ("drug_id") REFERENCES "Drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
