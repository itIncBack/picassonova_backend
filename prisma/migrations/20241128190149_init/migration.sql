/*
  Warnings:

  - The values [EMAIL_CONFIRMATION,RECOVERY_CODE] on the enum `ConfirmationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ConfirmationType_new" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RECOVERY');
ALTER TABLE "Confirmation" ALTER COLUMN "type" TYPE "ConfirmationType_new" USING ("type"::text::"ConfirmationType_new");
ALTER TYPE "ConfirmationType" RENAME TO "ConfirmationType_old";
ALTER TYPE "ConfirmationType_new" RENAME TO "ConfirmationType";
DROP TYPE "ConfirmationType_old";
COMMIT;
