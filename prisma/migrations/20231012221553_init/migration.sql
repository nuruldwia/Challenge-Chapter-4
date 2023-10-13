/*
  Warnings:

  - You are about to drop the column `identityTipe` on the `Profiles` table. All the data in the column will be lost.
  - Added the required column `identityType` to the `Profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profiles" DROP COLUMN "identityTipe",
ADD COLUMN     "identityType" TEXT NOT NULL;
