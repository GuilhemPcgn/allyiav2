import { PrismaClient, Sex, Role, IntakeStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  // Création des utilisateurs
  const users = await Promise.all([
    prisma.user.create({
      data: {
        firstname: 'Jean',
        lastname: 'Dupont',
        email: 'jean.dupont@email.com',
        phone: '0612345678',
        adress: '123 rue de Paris, 75001 Paris',
        birthdate: new Date('1980-05-15'),
        sex: Sex.Man,
        role: Role.Patient,
        password_hash: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Marie',
        lastname: 'Martin',
        email: 'marie.martin@email.com',
        phone: '0623456789',
        adress: '456 avenue des Champs-Élysées, 75008 Paris',
        birthdate: new Date('1985-08-20'),
        sex: Sex.Woman,
        role: Role.Doctor,
        password_hash: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Pierre',
        lastname: 'Durand',
        email: 'pierre.durand@email.com',
        phone: '0634567890',
        adress: '789 boulevard Saint-Michel, 75005 Paris',
        birthdate: new Date('1975-03-10'),
        sex: Sex.Man,
        role: Role.Pharmacist,
        password_hash: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Sophie',
        lastname: 'Leroy',
        email: 'sophie.leroy@email.com',
        phone: '0645678901',
        adress: '10 rue de la Paix, 75002 Paris',
        birthdate: new Date('1990-12-25'),
        sex: Sex.Woman,
        role: Role.Patient,
        password_hash: await bcrypt.hash('password123', 10),
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Thomas',
        lastname: 'Moreau',
        email: 'thomas.moreau@email.com',
        phone: '0656789012',
        adress: '15 avenue Victor Hugo, 75016 Paris',
        birthdate: new Date('1982-07-30'),
        sex: Sex.Man,
        role: Role.Doctor,
        password_hash: await bcrypt.hash('password123', 10),
      },
    }),
  ]);

  // Création des médicaments
  const drugs = await Promise.all([
    prisma.drug.create({
      data: {
        name: 'Paracétamol',
        dosage: '500mg',
        vidal_code: 'PARA500',
        description: 'Antidouleur et antipyrétique',
        side_effects: 'Rarement des réactions allergiques',
      },
    }),
    prisma.drug.create({
      data: {
        name: 'Ibuprofène',
        dosage: '400mg',
        vidal_code: 'IBUP400',
        description: 'Anti-inflammatoire non stéroïdien',
        side_effects: 'Peut causer des problèmes gastriques',
      },
    }),
    prisma.drug.create({
      data: {
        name: 'Amoxicilline',
        dosage: '1g',
        vidal_code: 'AMOX1000',
        description: 'Antibiotique de la famille des pénicillines',
        side_effects: 'Peut causer des réactions allergiques',
      },
    }),
    prisma.drug.create({
      data: {
        name: 'Oméprazole',
        dosage: '20mg',
        vidal_code: 'OMEZ20',
        description: 'Inhibiteur de la pompe à protons',
        side_effects: 'Peut causer des maux de tête',
      },
    }),
    prisma.drug.create({
      data: {
        name: 'Atorvastatine',
        dosage: '40mg',
        vidal_code: 'ATOR40',
        description: 'Statine pour réduire le cholestérol',
        side_effects: 'Peut causer des douleurs musculaires',
      },
    }),
    prisma.drug.create({
      data: {
        name: 'Metformine',
        dosage: '850mg',
        vidal_code: 'MET850',
        description: 'Antidiabétique oral',
        side_effects: 'Peut causer des troubles digestifs',
      },
    }),
  ]);

  // Création des ordonnances
  const ordinances = await Promise.all([
    prisma.ordinance.create({
      data: {
        user_id: users[0].id,
        date: new Date('2024-03-01'),
        doctor: 'Dr. Martin',
        scan_file: 'scan1.pdf',
        qr_code: 'qr123',
        text_analysis: 'Ordonnance pour traitement antibiotique',
      },
    }),
    prisma.ordinance.create({
      data: {
        user_id: users[1].id,
        date: new Date('2024-03-05'),
        doctor: 'Dr. Durand',
        scan_file: 'scan2.pdf',
        qr_code: 'qr456',
        text_analysis: 'Ordonnance pour traitement anti-inflammatoire',
      },
    }),
    prisma.ordinance.create({
      data: {
        user_id: users[3].id,
        date: new Date('2024-03-10'),
        doctor: 'Dr. Moreau',
        scan_file: 'scan3.pdf',
        qr_code: 'qr789',
        text_analysis: 'Ordonnance pour traitement du diabète',
      },
    }),
    prisma.ordinance.create({
      data: {
        user_id: users[0].id,
        date: new Date('2024-03-15'),
        doctor: 'Dr. Martin',
        scan_file: 'scan4.pdf',
        qr_code: 'qr101',
        text_analysis: 'Ordonnance pour traitement anti-cholestérol',
      },
    }),
  ]);

  // Création des prescriptions
  const prescriptions = await Promise.all([
    prisma.prescription.create({
      data: {
        ordinance_id: ordinances[0].id,
        drug_id: drugs[2].id,
        posology: '1 comprimé matin et soir',
        time_lenght: '7 jours',
      },
    }),
    prisma.prescription.create({
      data: {
        ordinance_id: ordinances[1].id,
        drug_id: drugs[1].id,
        posology: '1 comprimé toutes les 8 heures',
        time_lenght: '5 jours',
      },
    }),
    prisma.prescription.create({
      data: {
        ordinance_id: ordinances[2].id,
        drug_id: drugs[5].id,
        posology: '1 comprimé matin et soir',
        time_lenght: '30 jours',
      },
    }),
    prisma.prescription.create({
      data: {
        ordinance_id: ordinances[3].id,
        drug_id: drugs[4].id,
        posology: '1 comprimé le soir',
        time_lenght: '90 jours',
      },
    }),
    prisma.prescription.create({
      data: {
        ordinance_id: ordinances[0].id,
        drug_id: drugs[3].id,
        posology: '1 comprimé le matin',
        time_lenght: '14 jours',
      },
    }),
  ]);

  // Création des prises de médicaments
  const drugIntakes = await Promise.all([
    prisma.drugIntake.create({
      data: {
        user_id: users[0].id,
        drug_id: drugs[2].id,
        intake_date: new Date('2024-03-01T08:00:00'),
        status: IntakeStatus.Taked,
      },
    }),
    prisma.drugIntake.create({
      data: {
        user_id: users[0].id,
        drug_id: drugs[2].id,
        intake_date: new Date('2024-03-01T20:00:00'),
        status: IntakeStatus.To_take,
      },
    }),
    prisma.drugIntake.create({
      data: {
        user_id: users[3].id,
        drug_id: drugs[5].id,
        intake_date: new Date('2024-03-10T08:00:00'),
        status: IntakeStatus.Taked,
      },
    }),
    prisma.drugIntake.create({
      data: {
        user_id: users[3].id,
        drug_id: drugs[5].id,
        intake_date: new Date('2024-03-10T20:00:00'),
        status: IntakeStatus.Forgotten,
      },
    }),
    prisma.drugIntake.create({
      data: {
        user_id: users[0].id,
        drug_id: drugs[4].id,
        intake_date: new Date('2024-03-15T20:00:00'),
        status: IntakeStatus.To_take,
      },
    }),
  ]);

  // Création des authentifications
  const authentifications = await Promise.all([
    prisma.authentification.create({
      data: {
        user_id: users[0].id,
        provider: 'local',
        access_token: 'token123',
        refresh_token: 'refresh123',
        expires_at: new Date('2024-12-31'),
      },
    }),
    prisma.authentification.create({
      data: {
        user_id: users[1].id,
        provider: 'google',
        access_token: 'token456',
        refresh_token: 'refresh456',
        expires_at: new Date('2024-12-31'),
      },
    }),
    prisma.authentification.create({
      data: {
        user_id: users[3].id,
        provider: 'local',
        access_token: 'token789',
        refresh_token: 'refresh789',
        expires_at: new Date('2024-12-31'),
      },
    }),
    prisma.authentification.create({
      data: {
        user_id: users[4].id,
        provider: 'google',
        access_token: 'token101',
        refresh_token: 'refresh101',
        expires_at: new Date('2024-12-31'),
      },
    }),
  ]);

  console.log('Données de test créées avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 