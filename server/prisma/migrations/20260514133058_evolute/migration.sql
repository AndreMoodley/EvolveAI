-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "Practitioner" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
