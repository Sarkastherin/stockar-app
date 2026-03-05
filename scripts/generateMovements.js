import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// IDs de productos disponibles
const productIds = [
  "d8c49fd0-7d33-4f5d-a206-203a89c03279",
  "3aee8bf8-ef34-49f6-8c4b-e6458f9c9385",
  "0c94ef32-2f1f-4dbf-9cd2-a9cae183021d",
  "f8cb00f6-f76d-474e-a0c4-e1f5bca6b7ff",
  "610635a0-3f00-4518-95ca-d4f87c9eb8f5",
  "6456f80a-3e2b-4b03-a3d8-57d88eec9fd1",
  "dfb9a677-b815-4b95-8409-85efb885fd16",
  "2a2cf8d6-2ad0-4588-83c6-8eb35c439b85",
  "f2e560f2-5f7f-492b-95ba-fdc27a62fef0",
  "a26f8a38-8306-4658-a6a8-bdd4987a4baf",
  "5f1e880d-388f-4c7d-b16a-7226419cfd26",
  "0ba52964-8fe1-4707-9896-cf3f7b4782ef",
  "81917266-39b5-49e0-a0c4-091045f786f7",
  "8cf33ec5-2264-4f4d-8f43-0fd12c808376",
  "12846962-88c0-4f0a-9518-14d1d7c80640",
  "7b7f9c5e-2fc2-43cb-b6a3-9b1fb4b9ea62",
  "6142ed13-444d-4f8a-b17d-f93e55f6da18",
  "74dd854d-3a54-455e-bf49-639e2f18b9ad",
  "91e0d5ac-8973-4a30-aac6-834fef3137f0",
  "2d1ec85b-5280-4ccf-b019-a6f7debe62d9",
];

// IDs de usuarios para created_by y updated_by
const adminId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
const supervisorId = "550e8400-e29b-41d4-a716-446655440000";
const operatorIds = [
  "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "7f9e6b5c-1234-5678-9abc-def012345678",
  "8a7f6b5c-1234-5678-9abc-def012345679",
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const hour = getRandomInt(8, 18);
  const minute = getRandomInt(0, 59);
  const second = getRandomInt(0, 59);
  date.setHours(hour, minute, second, 0);
  return date.toISOString();
}

function generateMovements() {
  const movements = [];
  const total = 120;
  
  // Distribución de tipos: 40% ENTRY, 55% EXIT, 5% ADJUST
  const entryCount = Math.ceil(total * 0.40);
  const exitCount = Math.ceil(total * 0.55);
  const adjustCount = total - entryCount - exitCount;
  
  // Distribución de fechas: 20% hoy, 50% últimos 7 días, 30% últimos 30 días
  const todayCount = Math.ceil(total * 0.20);
  const last7Count = Math.ceil(total * 0.50);
  const last30Count = total - todayCount - last7Count;
  
  // Crear movimientos ENTRY
  for (let i = 0; i < entryCount; i++) {
    const daysAgo = generateDateFromDistribution(todayCount, last7Count, last30Count, i, entryCount);
    
    movements.push({
      id: randomUUID(),
      created_at: getRandomDate(daysAgo),
      created_by: getRandomElement([supervisorId, ...operatorIds]),
      updated_at: getRandomDate(daysAgo),
      updated_by: getRandomElement([supervisorId, ...operatorIds]),
      type: "ENTRY",
      id_product: getRandomElement(productIds),
      qty: getRandomInt(1, 50),
      note: `Entrada de stock ${i + 1}`,
      reference: `REF-ENTRY-${String(i + 1).padStart(4, '0')}`,
    });
  }
  
  // Crear movimientos EXIT
  for (let i = 0; i < exitCount; i++) {
    const daysAgo = generateDateFromDistribution(todayCount, last7Count, last30Count, i + entryCount, total);
    
    movements.push({
      id: randomUUID(),
      created_at: getRandomDate(daysAgo),
      created_by: getRandomElement([supervisorId, ...operatorIds]),
      updated_at: getRandomDate(daysAgo),
      updated_by: getRandomElement([supervisorId, ...operatorIds]),
      type: "EXIT",
      id_product: getRandomElement(productIds),
      qty: getRandomInt(1, 30),
      note: `Salida de stock ${i + 1}`,
      reference: `REF-EXIT-${String(i + 1).padStart(4, '0')}`,
    });
  }
  
  // Crear movimientos ADJUST
  for (let i = 0; i < adjustCount; i++) {
    const daysAgo = generateDateFromDistribution(todayCount, last7Count, last30Count, i + entryCount + exitCount, total);
    const type = i % 2 === 0 ? "ADJUST_POS" : "ADJUST_NEG";
    
    movements.push({
      id: randomUUID(),
      created_at: getRandomDate(daysAgo),
      created_by: adminId,
      updated_at: getRandomDate(daysAgo),
      updated_by: adminId,
      type: type,
      id_product: getRandomElement(productIds),
      qty: getRandomInt(1, 20),
      note: `Ajuste de inventario ${type}`,
      reference: `REF-ADJUST-${String(i + 1).padStart(4, '0')}`,
    });
  }
  
  // Shuffle the array
  for (let i = movements.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [movements[i], movements[j]] = [movements[j], movements[i]];
  }
  
  return movements;
}

function generateDateFromDistribution(todayCount, last7Count, last30Count, index, total) {
  const percent = (index / total) * 100;
  
  if (percent < (todayCount / total) * 100) {
    return 0; // Hoy
  } else if (percent < ((todayCount + last7Count) / total) * 100) {
    return getRandomInt(1, 7); // Últimos 7 días
  } else {
    return getRandomInt(8, 30); // Últimos 30 días
  }
}

function main() {
  const movements = generateMovements();
  
  const outputPath = path.join(__dirname, '..', 'public', 'api', 'movements.json');
  
  // Crear directorio si no existe
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(movements, null, 2));
  console.log(`✓ Archivo ${outputPath} generado exitosamente con ${movements.length} movimientos`);
}

main();
