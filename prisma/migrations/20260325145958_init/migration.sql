-- CreateEnum
CREATE TYPE "HenType" AS ENUM ('KATTI_KOLI', 'NALLA_KOLI', 'BOTH');

-- CreateEnum
CREATE TYPE "DiffType" AS ENUM ('BALANCE', 'EXTRA');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "henType" "HenType" NOT NULL,
    "kBox1" INTEGER,
    "kHen1" INTEGER,
    "kBox2" INTEGER,
    "kHen2" INTEGER,
    "kTotalHens" INTEGER,
    "kRate" DOUBLE PRECISION,
    "kAmount" DOUBLE PRECISION,
    "kLabour" DOUBLE PRECISION,
    "kTotal" DOUBLE PRECISION,
    "nBox1" INTEGER,
    "nHen1" INTEGER,
    "nBox2" INTEGER,
    "nHen2" INTEGER,
    "nTotalHens" INTEGER,
    "nNetWeight" DOUBLE PRECISION,
    "nWaterWeight" DOUBLE PRECISION,
    "nWeight" DOUBLE PRECISION,
    "nRate" DOUBLE PRECISION,
    "nAmount" DOUBLE PRECISION,
    "nLabour" DOUBLE PRECISION,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "paidAmount" DOUBLE PRECISION NOT NULL,
    "todayAmount" DOUBLE PRECISION NOT NULL,
    "todayType" "DiffType" NOT NULL,
    "oldAmount" DOUBLE PRECISION NOT NULL,
    "oldType" "DiffType" NOT NULL,
    "finalAmount" DOUBLE PRECISION NOT NULL,
    "finalType" "DiffType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "Transaction_date_idx" ON "Transaction"("date");
