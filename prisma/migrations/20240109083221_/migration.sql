-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('SENT', 'RECIEVED', 'DEPOSITED');

-- CreateTable
CREATE TABLE "AccountUSD" (
    "id" SERIAL NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "phoneId" INTEGER NOT NULL,

    CONSTRAINT "AccountUSD_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionsUSD" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "reciever_id" INTEGER NOT NULL,

    CONSTRAINT "TransactionsUSD_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountUSD_accountNumber_key" ON "AccountUSD"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AccountUSD_phoneId_key" ON "AccountUSD"("phoneId");

-- AddForeignKey
ALTER TABLE "AccountUSD" ADD CONSTRAINT "AccountUSD_phoneId_fkey" FOREIGN KEY ("phoneId") REFERENCES "Phone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionsUSD" ADD CONSTRAINT "TransactionsUSD_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "AccountUSD"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionsUSD" ADD CONSTRAINT "TransactionsUSD_reciever_id_fkey" FOREIGN KEY ("reciever_id") REFERENCES "AccountUSD"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
