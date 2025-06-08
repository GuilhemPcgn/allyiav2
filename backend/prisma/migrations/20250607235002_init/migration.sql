-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('Man', 'Woman', 'Other');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Patient', 'Doctor', 'Pharmacist');

-- CreateEnum
CREATE TYPE "IntakeStatus" AS ENUM ('To_take', 'Taked', 'Forgotten');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstname" VARCHAR(100) NOT NULL,
    "lastname" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "adress" VARCHAR(255),
    "birthdate" DATE NOT NULL,
    "sex" "Sex" NOT NULL,
    "role" "Role" NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Authentification" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Authentification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drug" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "molecule" TEXT,
    "dosage" VARCHAR(50),
    "vidal_code" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "side_effects" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Drug_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrugIntake" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "drug_id" INTEGER NOT NULL,
    "intake_date" TIMESTAMP(3) NOT NULL,
    "status" "IntakeStatus" NOT NULL,

    CONSTRAINT "DrugIntake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ordinance" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "doctor" VARCHAR(255) NOT NULL,
    "scan_file" TEXT,
    "qr_code" TEXT,
    "text_analysis" TEXT,
    "date_analysis" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ordinance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" SERIAL NOT NULL,
    "ordinance_id" INTEGER NOT NULL,
    "drug_id" INTEGER NOT NULL,
    "posology" TEXT NOT NULL,
    "time_lenght" VARCHAR(50) NOT NULL,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDrug" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "drugId" INTEGER NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "notes" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDrug_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Drug_vidal_code_key" ON "Drug"("vidal_code");

-- CreateIndex
CREATE UNIQUE INDEX "UserDrug_userId_drugId_key" ON "UserDrug"("userId", "drugId");

-- AddForeignKey
ALTER TABLE "Authentification" ADD CONSTRAINT "Authentification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrugIntake" ADD CONSTRAINT "DrugIntake_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrugIntake" ADD CONSTRAINT "DrugIntake_drug_id_fkey" FOREIGN KEY ("drug_id") REFERENCES "Drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ordinance" ADD CONSTRAINT "Ordinance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_ordinance_id_fkey" FOREIGN KEY ("ordinance_id") REFERENCES "Ordinance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_drug_id_fkey" FOREIGN KEY ("drug_id") REFERENCES "Drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDrug" ADD CONSTRAINT "UserDrug_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDrug" ADD CONSTRAINT "UserDrug_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
