/*
  Warnings:

  - A unique constraint covering the columns `[registrationCode]` on the table `Doorbell` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Doorbell_registrationCode_key" ON "Doorbell"("registrationCode");
