-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT,
    "about" TEXT,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);
