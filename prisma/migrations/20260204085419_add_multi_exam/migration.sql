/*
  Warnings:

  - A unique constraint covering the columns `[subjectName,examName]` on the table `ExamSettings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `examId` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `examId` to the `StudentAttempt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE examsettings_id_seq;
ALTER TABLE "ExamSettings" ALTER COLUMN "id" SET DEFAULT nextval('examsettings_id_seq');
ALTER SEQUENCE examsettings_id_seq OWNED BY "ExamSettings"."id";

-- AlterTable
-- Add examId as nullable first to allow backfill
ALTER TABLE "Question" ADD COLUMN "examId" INTEGER;

-- AlterTable
ALTER TABLE "StudentAttempt" ADD COLUMN "examId" INTEGER;

-- CreateIndex
CREATE INDEX "ExamSettings_isActive_idx" ON "ExamSettings"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ExamSettings_subjectName_examName_key" ON "ExamSettings"("subjectName", "examName");

-- CreateIndex
CREATE INDEX "StudentAttempt_examId_idx" ON "StudentAttempt"("examId");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_examId_fkey" FOREIGN KEY ("examId") REFERENCES "ExamSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAttempt" ADD CONSTRAINT "StudentAttempt_examId_fkey" FOREIGN KEY ("examId") REFERENCES "ExamSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill examId for existing data
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM "ExamSettings" WHERE "id" = 1) THEN
    INSERT INTO "ExamSettings" ("id", "isActive", "updatedAt") VALUES (1, FALSE, NOW());
  END IF;
END $$;

-- Ensure updatedAt is not NULL to satisfy NOT NULL constraints
UPDATE "ExamSettings" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;

UPDATE "Question" SET "examId" = 1 WHERE "examId" IS NULL;
UPDATE "StudentAttempt" SET "examId" = 1 WHERE "examId" IS NULL;

-- Enforce NOT NULL after backfill
ALTER TABLE "Question" ALTER COLUMN "examId" SET NOT NULL;
ALTER TABLE "StudentAttempt" ALTER COLUMN "examId" SET NOT NULL;
