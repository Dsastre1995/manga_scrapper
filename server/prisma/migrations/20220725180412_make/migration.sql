/*
  Warnings:

  - You are about to alter the column `chapterNumber` on the `Chapter` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `Chapter` MODIFY `chapterNumber` DOUBLE NOT NULL DEFAULT 0.00;
