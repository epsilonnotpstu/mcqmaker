import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');
  
  // Create a sample exam settings
  const examSettings = await prisma.examSettings.upsert({
    where: { 
      subjectName_examName: {
        subjectName: "Mathematics",
        examName: "Sample MCQ Test"
      }
    },
    update: {},
    create: {
      examName: "Sample MCQ Test",
      subjectName: "Mathematics", 
      chapterName: "Basic Math",
      totalTimeMinutes: 60,
      marksPerCorrect: 4,
      negativePerWrong: -1,
      isActive: true,
      totalQuestions: 0
    }
  });

  console.log('Sample exam settings created:', examSettings);

  // Add sample questions
  const sampleQuestions = [
    {
      questionText: "What is 2 + 2?",
      option1: "3",
      option2: "4", 
      option3: "5",
      option4: "6",
      correctIndex: 1, // option2 is correct
      examId: examSettings.id
    },
    {
      questionText: "What is the square root of 16?",
      option1: "2",
      option2: "3",
      option3: "4",
      option4: "5", 
      correctIndex: 2, // option3 is correct
      examId: examSettings.id
    }
  ];

  for (const question of sampleQuestions) {
    await prisma.question.upsert({
      where: { 
        id: -1 // This will always create new since -1 doesn't exist
      },
      update: {},
      create: question
    });
  }

  // Update total questions count
  await prisma.examSettings.update({
    where: { id: examSettings.id },
    data: { totalQuestions: sampleQuestions.length }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });