require('dotenv').config();
const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');
const LoadingSession = require('../models/LoadingSession');
const ExcavatorCycle = require('../models/ExcavatorCycle');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tracking_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seedDatabase() {
  try {
    console.log('🧹 Nettoyage de la base de données...');
    await Vehicle.deleteMany({});
    await LoadingSession.deleteMany({});
    await ExcavatorCycle.deleteMany({});
    
    console.log('🌱 Génération des données exemple...');
    
    const excavators = await Vehicle.insertMany([
      {
        type: 'PELLETEUSE',
        registration_number: 'PEL-001',
        model: 'CAT 320',
        capacity: 18000,
        manufacturer: 'Caterpillar',
        status: 'ACTIF',
        qr_code: 'QR-PEL-001'
      },
      {
        type: 'PELLETEUSE',
        registration_number: 'PEL-002',
        model: 'Komatsu PC210',
        capacity: 20000,
        manufacturer: 'Komatsu',
        status: 'ACTIF',
        qr_code: 'QR-PEL-002'
      },
      {
        type: 'PELLETEUSE',
        registration_number: 'PEL-003',
        model: 'Volvo EC220',
        capacity: 22000,
        manufacturer: 'Volvo',
        status: 'MAINTENANCE',
        qr_code: 'QR-PEL-003'
      }
    ]);
    
    const trucks = await Vehicle.insertMany([
      {
        type: 'CAMION',
        registration_number: 'CAM-001',
        model: 'Mercedes Actros',
        capacity: 40000,
        manufacturer: 'Mercedes',
        status: 'ACTIF',
        qr_code: 'QR-CAM-001'
      },
      {
        type: 'CAMION',
        registration_number: 'CAM-002',
        model: 'Volvo FH16',
        capacity: 42000,
        manufacturer: 'Volvo',
        status: 'ACTIF',
        qr_code: 'QR-CAM-002'
      },
      {
        type: 'CAMION',
        registration_number: 'CAM-003',
        model: 'Scania R450',
        capacity: 38000,
        manufacturer: 'Scania',
        status: 'HORS_SERVICE',
        qr_code: 'QR-CAM-003'
      },
      {
        type: 'CAMION',
        registration_number: 'CAM-004',
        model: 'MAN TGX',
        capacity: 39000,
        manufacturer: 'MAN',
        status: 'ACTIF',
        qr_code: 'QR-CAM-004'
      }
    ]);
    
    console.log(`✅ ${excavators.length} pelleteuses créées`);
    console.log(`✅ ${trucks.length} camions créés`);
    
    const sessions = [];
    const statuses = ['OK', 'WARNING_LOAD', 'WARNING_THEFT', 'EN_COURS'];
    
    for (let i = 0; i < 15; i++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30));
      startDate.setHours(8 + Math.floor(Math.random() * 8));
      
      const session = new LoadingSession({
        excavator_id: excavators[Math.floor(Math.random() * 2)]._id,
        truck_id: trucks[Math.floor(Math.random() * 3)]._id,
        start_time: startDate,
        operator_name: `Opérateur ${i + 1}`,
        destination: i % 2 === 0 ? 'Chantier Nord' : 'Chantier Sud',
        total_weight_excavator: 15000 + Math.random() * 5000,
        total_weight_truck_start: 15200 + Math.random() * 5000,
        total_weight_truck_arrival: i % 3 === 0 ? 15100 + Math.random() * 5000 : 15200 + Math.random() * 5000,
        alert_status: statuses[Math.floor(Math.random() * statuses.length)],
        is_active: i === 0
      });
      
      await session.save();
      sessions.push(session);
      
      const numCycles = 5 + Math.floor(Math.random() * 10);
      for (let j = 0; j < numCycles; j++) {
        const cycle = new ExcavatorCycle({
          session_id: session._id,
          bucket_weight: 1500 + Math.random() * 500,
          travel_distance: 10 + Math.random() * 20,
          material_type: ['GRAVIER', 'SABLE', 'TERRE'][Math.floor(Math.random() * 3)],
          timestamp: new Date(startDate.getTime() + j * 60000)
        });
        await cycle.save();
      }
    }
    
    console.log(`✅ ${sessions.length} sessions créées avec cycles`);
    console.log('🎉 Base de données peuplée avec succès !');
    
    const totalVehicles = await Vehicle.countDocuments();
    const totalSessions = await LoadingSession.countDocuments();
    const totalCycles = await ExcavatorCycle.countDocuments();
    
    console.log('\n📊 Résumé final :');
    console.log(`   Véhicules: ${totalVehicles}`);
    console.log(`   Sessions: ${totalSessions}`);
    console.log(`   Cycles: ${totalCycles}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
    process.exit(1);
  }
}

seedDatabase();
