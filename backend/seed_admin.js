const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  await prisma.admin.upsert({
    where: { email: 'admin@f1deals.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@f1deals.com',
      password: hashedPassword,
    },
  });
  console.log('Admin user seeded');
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
