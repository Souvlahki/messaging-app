/*
  Warnings:

  - You are about to drop the column `friendId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "friendId",
ALTER COLUMN "password" SET DATA TYPE TEXT;
