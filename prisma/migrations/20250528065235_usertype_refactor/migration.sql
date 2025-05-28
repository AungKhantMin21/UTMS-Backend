/*
  Warnings:

  - You are about to drop the column `userType` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "userType";

-- DropEnum
DROP TYPE "UserType";

-- CreateTable
CREATE TABLE "UserType" (
    "id" TEXT NOT NULL,
    "typeName" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTypeMapping" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userTypeId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTypeMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserType_typeName_key" ON "UserType"("typeName");

-- CreateIndex
CREATE UNIQUE INDEX "UserTypeMapping_userId_userTypeId_key" ON "UserTypeMapping"("userId", "userTypeId");

-- AddForeignKey
ALTER TABLE "UserTypeMapping" ADD CONSTRAINT "UserTypeMapping_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTypeMapping" ADD CONSTRAINT "UserTypeMapping_userTypeId_fkey" FOREIGN KEY ("userTypeId") REFERENCES "UserType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
