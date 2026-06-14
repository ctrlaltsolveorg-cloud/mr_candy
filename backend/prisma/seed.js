const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('1234', 10);

  // Users
  await prisma.user.upsert({
    where: { phone: '1111' },
    update: {},
    create: {
      phone: '1111',
      password: hashedPassword,
      name: 'Admin Sahab',
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { phone: '2222' },
    update: {},
    create: {
      phone: '2222',
      password: hashedPassword,
      name: 'Mummy',
      role: 'MOTHER',
    },
  });

  await prisma.user.upsert({
    where: { phone: '3333' },
    update: {},
    create: {
      phone: '3333',
      password: hashedPassword,
      name: 'Raju Delivery',
      role: 'DELIVERY',
    },
  });

  await prisma.user.upsert({
    where: { phone: '4444' },
    update: {},
    create: {
      phone: '4444',
      password: hashedPassword,
      name: 'Customer',
      role: 'CUSTOMER',
    },
  });

  // Products
  await prisma.product.createMany({
    data: [
      {
        name: 'Kurkure Masala Munch',
        wholesaleUnitQty: 15, // 1 pack = 15 units
        price: 10,
        retailStock: 30,
        photoUrl: 'https://m.media-amazon.com/images/I/71YyP02n-7L._SL1500_.jpg',
      },
      {
        name: 'Sugar (Chini)',
        wholesaleUnitQty: 5, // 1 pack = 5 kg
        price: 45,
        retailStock: 50,
        photoUrl: 'https://5.imimg.com/data5/ANDROID/Default/2021/6/YI/SD/RX/131584252/product-jpeg-500x500.jpg',
      },
      {
        name: 'Lays Magic Masala',
        wholesaleUnitQty: 20, // 1 box = 20 units
        price: 20,
        retailStock: 40,
        photoUrl: 'https://m.media-amazon.com/images/I/71K23X15CML._SL1500_.jpg',
      },
    ],
  });

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
