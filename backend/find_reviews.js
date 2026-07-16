const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const reviews = await prisma.review.findMany();
  console.log(JSON.stringify(reviews, null, 2));
}

main().finally(() => prisma.$disconnect());
