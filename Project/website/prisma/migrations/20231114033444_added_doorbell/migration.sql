-- AlterTable
ALTER TABLE "Doorbell" ADD COLUMN     "silentEnd" TIMESTAMP(3),
ADD COLUMN     "silentStart" TIMESTAMP(3),
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "DoorbellLog" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "doorbellId" INTEGER NOT NULL,

    CONSTRAINT "DoorbellLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DoorbellLog" ADD CONSTRAINT "DoorbellLog_doorbellId_fkey" FOREIGN KEY ("doorbellId") REFERENCES "Doorbell"("id") ON DELETE CASCADE ON UPDATE CASCADE;
