// prisma/seed.ts
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding process...');

  const rawData = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf-8');
  const products = JSON.parse(rawData);

  for (const p of products) {
    // 1. Create or find brand
    const brand = await prisma.brand.upsert({
      where: { name: p.brand?.name || 'Unknown Brand' },
      update: {},
      create: {
        name: p.brand?.name || 'Unknown Brand',
        websiteUrl: p.baseUrl ? new URL(p.baseUrl).origin : null,
      },
    });

    // 2. Create or update product
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        source: p.source || 'Unknown',
        sourceProductId: p.sourceProductId || '',
        name: p.name || 'Unnamed Product',
        description: p.description || `High-quality ${p.name || 'product'} from ${brand.name}.`,
        imageUrls: p.imageUrls || [],
        baseUrl: p.baseUrl || '',
        brandId: brand.id,
        price: p.price || null,
        currency: p.currency || 'INR',
      },
    });
  }

  console.log(`✅ Seeding complete. Total products processed: ${products.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
