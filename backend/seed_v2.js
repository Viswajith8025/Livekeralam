const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./src/models/Event');
const Place = require('./src/models/Place');
const connectDB = require('./src/config/db');

dotenv.config();

const events = [
  {
    title: "HananSha Live in Concert",
    description: "An ethereal musical journey with HananSha, featuring a fusion of soulful melodies and modern electronic beats. A one-night-exclusive event in the heart of Kochi.",
    date: new Date('2026-05-15T19:00:00'),
    location: "Bolgatty Palace Grounds, Kochi",
    district: "Ernakulam",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1000",
    price: 1500,
    organizer: "HananSha Official",
    status: "approved"
  },
  {
    title: "Vedan Live: The Voice of Streets",
    description: "Experience the raw energy of Vedan as he takes the stage at Trivandrum. A powerful hip-hop performance that brings the stories of the streets to life.",
    date: new Date('2026-06-20T18:30:00'),
    location: "Nishagandhi Auditorium, Trivandrum",
    district: "Thiruvananthapuram",
    category: "Other",
    image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=1000",
    price: 800,
    organizer: "StreetVoice Entertainment",
    status: "approved"
  },
  {
    title: "Grand Kerala Car Expo 2026",
    description: "The biggest automotive show in South India. Discover supercars, electric vehicles, and classic vintage collections all under one roof.",
    date: new Date('2026-04-10T10:00:00'),
    location: "Calicut Trade Centre, Kozhikode",
    district: "Kozhikode",
    category: "Other",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000",
    price: 200,
    organizer: "AutoExpo Kerala",
    status: "approved"
  },
  {
    title: "Malabar International Food Festival",
    description: "A culinary feast featuring authentic flavors from across Malabar and international guest chefs. Cooking workshops, live music, and endless tasting stalls.",
    date: new Date('2026-07-05T12:00:00'),
    location: "Pookode Lake Grounds, Wayanad",
    district: "Wayanad",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1000",
    price: 0,
    organizer: "Wayanad Tourism Council",
    status: "approved"
  }
];

const places = [
  {
    name: "Sree Padmanabhaswamy Temple",
    district: "Thiruvananthapuram",
    category: "Temple",
    image: "https://images.unsplash.com/photo-1622321457187-5114757530c8?auto=format&fit=crop&q=80&w=2000",
    description: "One of the 108 Divya Desams, the temple is a stunning example of the Chera style and Dravidian style of architecture, famous for its hidden vaults and intricate stone carvings."
  },
  {
    name: "Kozhikode Beach",
    district: "Kozhikode",
    category: "Beach",
    image: "https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&q=80&w=2000",
    description: "A historic beach on the Malabar Coast, known for its old-world charm, signature lighthouse, and the hundred-year-old piers that extend into the Arabian Sea."
  },
  {
    name: "Fort Kochi",
    district: "Ernakulam",
    category: "Heritage",
    image: "https://images.unsplash.com/photo-1593694466041-8f0261f27ad6?auto=format&fit=crop&q=80&w=2000",
    description: "A charming seaside area where history whispers through Chinese fishing nets, colonial-era architecture, and the vibrant art scene of the Mattancherry Palace."
  }
];

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Event.deleteMany();
    await Place.deleteMany();
    
    // Insert new data
    await Event.insertMany(events);
    await Place.insertMany(places);
    
    console.log('Database Seeded Successfully with HD Heritage Visuals! 🌴🌟');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
