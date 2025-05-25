-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('SUPPORT', 'ADMIN', 'PRODUCT_MANAGER');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('IN_PROGRESS', 'BLOCKED', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('URGENT', 'LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "passwordConfirm" TEXT,
    "userType" "UserType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubTaskType" (
    "id" TEXT NOT NULL,
    "taskTypeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "estimatedHours" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubTaskType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureModule" (
    "id" TEXT NOT NULL,
    "moduleName" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "taskTypeId" TEXT NOT NULL,
    "subTaskTypeId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "assigneeUserId" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "completionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Handbook" (
    "id" TEXT NOT NULL,
    "sub_task_type_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "contentMarkdown" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "lastModifiedByUserId" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Handbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HandbookTag" (
    "id" TEXT NOT NULL,
    "tagName" TEXT NOT NULL,
    "colorHex" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HandbookTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HandbookTagMapping" (
    "id" TEXT NOT NULL,
    "handbookId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HandbookTagMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_fullName_key" ON "User"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TaskType_name_key" ON "TaskType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubTaskType_taskTypeId_name_key" ON "SubTaskType"("taskTypeId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureModule_moduleName_key" ON "FeatureModule"("moduleName");

-- CreateIndex
CREATE UNIQUE INDEX "HandbookTag_tagName_key" ON "HandbookTag"("tagName");

-- CreateIndex
CREATE UNIQUE INDEX "HandbookTagMapping_handbookId_tagId_key" ON "HandbookTagMapping"("handbookId", "tagId");

-- AddForeignKey
ALTER TABLE "SubTaskType" ADD CONSTRAINT "SubTaskType_taskTypeId_fkey" FOREIGN KEY ("taskTypeId") REFERENCES "TaskType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_taskTypeId_fkey" FOREIGN KEY ("taskTypeId") REFERENCES "TaskType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_subTaskTypeId_fkey" FOREIGN KEY ("subTaskTypeId") REFERENCES "SubTaskType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "FeatureModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeUserId_fkey" FOREIGN KEY ("assigneeUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Handbook" ADD CONSTRAINT "Handbook_sub_task_type_id_fkey" FOREIGN KEY ("sub_task_type_id") REFERENCES "SubTaskType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Handbook" ADD CONSTRAINT "Handbook_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Handbook" ADD CONSTRAINT "Handbook_lastModifiedByUserId_fkey" FOREIGN KEY ("lastModifiedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HandbookTagMapping" ADD CONSTRAINT "HandbookTagMapping_handbookId_fkey" FOREIGN KEY ("handbookId") REFERENCES "Handbook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HandbookTagMapping" ADD CONSTRAINT "HandbookTagMapping_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "HandbookTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
