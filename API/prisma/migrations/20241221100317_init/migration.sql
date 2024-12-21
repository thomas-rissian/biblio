/*
  Warnings:

  - You are about to drop the `BookCategory` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `description` on table `Book` required. This step will fail if there are existing NULL values in that column.
  - Made the column `publicationDate` on table `Book` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "BookCategory" DROP CONSTRAINT "BookCategory_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BookCategory" DROP CONSTRAINT "BookCategory_categoryId_fkey";

-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "publicationDate" SET NOT NULL;

-- DropTable
DROP TABLE "BookCategory";
