-- AlterTable
ALTER TABLE "Backups" ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Backups" ADD CONSTRAINT "Backups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
