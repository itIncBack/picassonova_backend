-- DropForeignKey
ALTER TABLE "Confirmation" DROP CONSTRAINT "Confirmation_user_id_fkey";

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "ip" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "device_id" UUID NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Confirmation" ADD CONSTRAINT "Confirmation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
