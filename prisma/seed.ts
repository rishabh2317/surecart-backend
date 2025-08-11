// prisma/seed.ts
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding for world-class homepage...');

  // --- Clean up old data ---
  // --- Clean up old data ---
  await prisma.click.deleteMany({});
  await prisma.userLikes.deleteMany({});
  await prisma.collectionProduct.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.follow.deleteMany({});
  await prisma.collection.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.user.deleteMany({});
  
  // --- Create Users (Creators) ---
  const userRishu = await prisma.user.create({
    data: {
      id: 'user_rishu_123',
      authProviderId: 'hashed_password_rishu', // In real life, this would be a real hash
      username: 'rishu',
      email: 'rishu@surecart.dev',
      profileImageUrl: 'https://placehold.co/100x100/E2E8F0/475569?text=R',
    },
  });

  const userAisha = await prisma.user.create({
    data: {
      id: 'user_aisha_456',
      authProviderId: 'hashed_password_aisha',
      username: 'aisha',
      email: 'aisha@surecart.dev',
      profileImageUrl: 'https://placehold.co/100x100/FEE2E2/991B1B?text=A',
    },
  });

  // --- Create Brands & Products ---
  const brandOrdinary = await prisma.brand.create({ data: { name: 'The Ordinary' } });
  const brandCerave = await prisma.brand.create({ data: { name: 'CeraVe' } });
  const brandSupergoop = await prisma.brand.create({ data: { name: 'Supergoop!' } });

  const productSerum = await prisma.product.create({ data: { 
      id: 'prod_serum', 
      name: 'Niacinamide Serum', 
      imageUrls: ['https://placehold.co/600x800/E0E7FF/4F46E5?text=Serum'], 
      brandId: brandOrdinary.id, 
      source: 'mock', 
      sourceProductId: 'mock1', 
      baseUrl: 'https://www.amazon.in/dp/B072M63S1V' // Real URL
  }});
  const productCleanser = await prisma.product.create({ data: { 
      id: 'prod_cleanser', 
      name: 'Hydrating Cleanser', 
      imageUrls: ['https://placehold.co/600x600/DBEAFE/1E40AF?text=Cleanser'], 
      brandId: brandCerave.id, 
      source: 'mock', 
      sourceProductId: 'mock2', 
      baseUrl: 'https://www.amazon.in/dp/B01MSSDEPK' // Real URL
  }});
  const productSunscreen = await prisma.product.create({ data: { 
      id: 'prod_sunscreen', 
      name: 'Unseen Sunscreen', 
      imageUrls: ['https://placehold.co/600x700/FEF3C7/92400E?text=Sunscreen'], 
      brandId: brandSupergoop.id, 
      source: 'mock', 
      sourceProductId: 'mock3', 
      baseUrl: 'https://www.amazon.in/dp/B07912542C' // Real URL
  }});
  // --- Create Collections ---
  await prisma.collection.create({
    data: {
      name: 'My Skincare Picks',
      slug: 'my-skincare-picks',
      userId: userRishu.id,
      products: {
        create: [
          { productId: productSerum.id, displayOrder: 0 },
          { productId: productCleanser.id, displayOrder: 1 },
        ],
      },
    },
  });

  await prisma.collection.create({
    data: {
      name: 'Goa Beach Trip Fits',
      slug: 'goa-beach-trip-fits',
      userId: userAisha.id,
      products: {
        create: [
          { productId: productSunscreen.id, displayOrder: 0 },
        ],
      },
    },
  });
  
  await prisma.collection.create({
    data: {
      name: 'Monsoon Essentials',
      slug: 'monsoon-essentials',
      userId: userRishu.id,
      products: {
        create: [
          { productId: productCleanser.id, displayOrder: 0 },
          { productId: productSunscreen.id, displayOrder: 1 },
        ],
      },
    },
  });

  console.log('Seeding finished.');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });