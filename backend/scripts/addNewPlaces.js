const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Place = require('../src/models/Place');

dotenv.config();

const newPlaces = [
  {
    name: 'Kozhikode Beach',
    description: 'A historic beach known for its beautiful sunsets, old-world charm, and a 100-year-old pier. Perfect for a evening stroll and local snacks like Kallummakkaya.',
    district: 'Kozhikode',
    category: 'Beach',
    image: 'https://images.unsplash.com/photo-1590603741103-99738f65a121?auto=format&fit=crop&q=80&w=1000',
    coordinates: { lat: 11.2588, lng: 75.7741 }
  },
  {
    name: 'Fort Kochi',
    description: 'A water-bound region that showcases a blend of Dutch, Portuguese, and British colonial architecture. Famous for its Chinese Fishing Nets and vibrant street art.',
    district: 'Ernakulam',
    category: 'Heritage',
    image: 'https://images.unsplash.com/photo-1589997321632-1bae0040498b?auto=format&fit=crop&q=80&w=1000',
    coordinates: { lat: 9.9658, lng: 76.2421 }
  },
  {
    name: 'Sree Padmanabhaswamy Temple',
    description: 'An architectural marvel in the heart of Trivandrum, dedicated to Lord Vishnu. It is one of the 108 Divya Desams and known for its spiritual significance and hidden treasures.',
    district: 'Thiruvananthapuram',
    category: 'Spiritual',
    image: 'https://images.unsplash.com/photo-1616423641454-ec6965668728?auto=format&fit=crop&q=80&w=1000',
    coordinates: { lat: 8.4831, lng: 76.9436 }
  }
];

const seedNewPlaces = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    for (const place of newPlaces) {
      const exists = await Place.findOne({ name: place.name });
      if (!exists) {
        await Place.create(place);
        console.log(`Added: ${place.name}`);
      } else {
        console.log(`Skipped (already exists): ${place.name}`);
      }
    }

    console.log('Seeding complete.');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedNewPlaces();
