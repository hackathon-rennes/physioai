const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const names = [
    { f: 'Lucas', l: 'Martin', done: true },
    { f: 'Emma', l: 'Bernard', done: false },
    { f: 'Thomas', l: 'Dubois', done: true },
    { f: 'Chloé', l: 'Thomas', done: false },
    { f: 'Nicolas', l: 'Robert', done: false },
    { f: 'Julie', l: 'Richard', done: true },
    { f: 'Maxime', l: 'Petit', done: false },
    { f: 'Sarah', l: 'Durand', done: true },
    { f: 'Antoine', l: 'Leroy', done: false },
    { f: 'Laura', l: 'Moreau', done: false }
  ];

  console.log('Suppression des fausses donnees existantes...');
  // Nettoyage rapide pour ne pas faire de doublons sur les emails
  await prisma.assessment.deleteMany();
  await prisma.patient.deleteMany();

  console.log('Génération de 10 patients et bilans...');
  
  for (let i = 0; i < names.length; i++) {
    const p = names[i];
    
    // Dates de RDV étalées sur les prochains jours
    const rdv = new Date();
    rdv.setDate(rdv.getDate() + i + 1);
    rdv.setHours(9 + (i % 8), 0, 0, 0); 

    await prisma.patient.create({
      data: {
        tenantId: "hackathon-tenant",
        maiaId: `MAIA-${1000 + i}`,
        firstName: p.f,
        lastName: p.l,
        email: `${p.f.toLowerCase()}.${p.l.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}@example.com`,
        assessments: {
          create: {
            status: p.done ? 'QUESTIONNAIRE_COMPLETED' : 'DRAFT',
            isPreAssessmentDone: p.done,
            scheduledAt: rdv,
            notes: p.done ? '{"gender":"H","age":34,"expectations":"Reprise après entorse"}' : null
          }
        }
      }
    });
  }
  console.log('Seeding terminé avec succès !');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
