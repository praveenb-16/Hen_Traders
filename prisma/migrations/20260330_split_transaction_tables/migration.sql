-- Drop old Transaction table and its indexes
DROP INDEX IF EXISTS "Transaction_date_idx";
DROP TABLE IF EXISTS "Transaction";

-- CreateTable: KattiKoli
CREATE TABLE "KattiKoli" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "box1" INTEGER NOT NULL,
    "hen1" INTEGER NOT NULL,
    "box2" INTEGER NOT NULL,
    "hen2" INTEGER NOT NULL,
    "box3" INTEGER,
    "hen3" INTEGER,
    "totalHens" INTEGER NOT NULL,
    "freeHen" INTEGER,
    "rate" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "labour" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "dailyBalanceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KattiKoli_pkey" PRIMARY KEY ("id")
);

-- CreateTable: NallaKoli
CREATE TABLE "NallaKoli" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "box1" INTEGER NOT NULL,
    "hen1" INTEGER NOT NULL,
    "box2" INTEGER NOT NULL,
    "hen2" INTEGER NOT NULL,
    "box3" INTEGER,
    "hen3" INTEGER,
    "totalHens" INTEGER NOT NULL,
    "freeHen" INTEGER,
    "netWeight" DOUBLE PRECISION NOT NULL,
    "waterWeight" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "labour" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "dailyBalanceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NallaKoli_pkey" PRIMARY KEY ("id")
);

-- CreateTable: BothTransaction
CREATE TABLE "BothTransaction" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kBox1" INTEGER NOT NULL,
    "kHen1" INTEGER NOT NULL,
    "kBox2" INTEGER NOT NULL,
    "kHen2" INTEGER NOT NULL,
    "kBox3" INTEGER,
    "kHen3" INTEGER,
    "kTotalHens" INTEGER NOT NULL,
    "kFreeHen" INTEGER,
    "kRate" DOUBLE PRECISION NOT NULL,
    "kAmount" DOUBLE PRECISION NOT NULL,
    "kLabour" DOUBLE PRECISION NOT NULL,
    "kTotal" DOUBLE PRECISION NOT NULL,
    "nBox1" INTEGER NOT NULL,
    "nHen1" INTEGER NOT NULL,
    "nBox2" INTEGER NOT NULL,
    "nHen2" INTEGER NOT NULL,
    "nBox3" INTEGER,
    "nHen3" INTEGER,
    "nTotalHens" INTEGER NOT NULL,
    "nFreeHen" INTEGER,
    "nNetWeight" DOUBLE PRECISION NOT NULL,
    "nWaterWeight" DOUBLE PRECISION NOT NULL,
    "nWeight" DOUBLE PRECISION NOT NULL,
    "nRate" DOUBLE PRECISION NOT NULL,
    "nAmount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "dailyBalanceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BothTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable: DailyBalance
CREATE TABLE "DailyBalance" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "henType" "HenType" NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "paidAmount" DOUBLE PRECISION NOT NULL,
    "todayAmount" DOUBLE PRECISION NOT NULL,
    "todayType" "DiffType" NOT NULL,
    "oldAmount" DOUBLE PRECISION NOT NULL,
    "oldType" "DiffType" NOT NULL,
    "finalAmount" DOUBLE PRECISION NOT NULL,
    "finalType" "DiffType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyBalance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KattiKoli_dailyBalanceId_key" ON "KattiKoli"("dailyBalanceId");
CREATE UNIQUE INDEX "NallaKoli_dailyBalanceId_key" ON "NallaKoli"("dailyBalanceId");
CREATE UNIQUE INDEX "BothTransaction_dailyBalanceId_key" ON "BothTransaction"("dailyBalanceId");
CREATE INDEX "KattiKoli_date_idx" ON "KattiKoli"("date");
CREATE INDEX "NallaKoli_date_idx" ON "NallaKoli"("date");
CREATE INDEX "BothTransaction_date_idx" ON "BothTransaction"("date");
CREATE INDEX "DailyBalance_date_idx" ON "DailyBalance"("date");

-- AddForeignKey
ALTER TABLE "KattiKoli" ADD CONSTRAINT "KattiKoli_dailyBalanceId_fkey" FOREIGN KEY ("dailyBalanceId") REFERENCES "DailyBalance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "NallaKoli" ADD CONSTRAINT "NallaKoli_dailyBalanceId_fkey" FOREIGN KEY ("dailyBalanceId") REFERENCES "DailyBalance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BothTransaction" ADD CONSTRAINT "BothTransaction_dailyBalanceId_fkey" FOREIGN KEY ("dailyBalanceId") REFERENCES "DailyBalance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
