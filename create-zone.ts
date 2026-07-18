import { DataSource } from 'typeorm';
import { typeOrmConfig } from './src/config/typeorm.config';
import { v4 as uuid } from 'uuid';

async function main() {
  const dataSource = new DataSource(typeOrmConfig);
  await dataSource.initialize();

  // Get first hotel
  const hotel = await dataSource.query(`SELECT id, name FROM hotels LIMIT 1`);
  if (!hotel.length) {
    console.log('❌ No hotels found. Create a hotel first.');
    await dataSource.destroy();
    return;
  }

  const hotelId = hotel[0].id;
  console.log(`✓ Using hotel: ${hotel[0].name}`);

  // Create sample geofence zone
  const zoneId = uuid();
  const points = [
    { lat: 31.945, lng: 35.928 },
    { lat: 31.946, lng: 35.928 },
    { lat: 31.946, lng: 35.929 },
    { lat: 31.945, lng: 35.929 },
  ];

  await dataSource.query(
    `INSERT INTO "geofence_zones" ("id", "hotelId", "name", "points", "isActive", "createdAt")
     VALUES ($1, $2, $3, $4, true, now())`,
    [zoneId, hotelId, 'Main Entrance', JSON.stringify(points)]
  );

  console.log('✓ Created geofence zone: Main Entrance');
  await dataSource.destroy();
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
