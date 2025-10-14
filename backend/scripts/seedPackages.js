const mongoose = require('mongoose');
const Package = require('../models/Package');
require('dotenv').config();

const samplePackages = [
  {
    title: "Bali Paradise Adventure",
    description: "Experience the magic of Bali with pristine beaches, ancient temples, and lush rice terraces.",
    destination: "Bali, Indonesia",
    duration: { days: 7, nights: 6 },
    price: { basePrice: 35999, currency: 'INR' },
    pricing: { adult: 35999, child: 26999, infant: 8999 },
    category: "Beach",
    images: [
      { url: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=500", caption: "Bali Beach" },
      { url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=500", caption: "Temple View" }
    ],
    inclusions: [
      "Round-trip flights",
      "4-star hotel accommodation",
      "Daily breakfast",
      "Temple tours",
      "Airport transfers",
      "English-speaking guide"
    ],
    exclusions: [
      "Lunch and dinner",
      "Personal expenses",
      "Travel insurance",
      "Visa fees"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Bali", description: "Welcome to paradise", activities: ["Airport pickup", "Hotel check-in", "Welcome dinner"], meals: ["Dinner"] },
      { day: 2, title: "Ubud Cultural Tour", description: "Explore cultural heart", activities: ["Rice terrace visit", "Monkey forest", "Traditional market"], meals: ["Breakfast", "Lunch"] },
      { day: 3, title: "Temple Hopping", description: "Sacred temples tour", activities: ["Tanah Lot Temple", "Uluwatu Temple", "Kecak dance show"], meals: ["Breakfast"] }
    ],
    availability: {
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-12-31')
    },
    groupSize: { min: 2, max: 20 },
    isActive: true
  },
  {
    title: "Swiss Alps Mountain Trek",
    description: "Breathtaking mountain adventure through the Swiss Alps with stunning alpine views.",
    destination: "Swiss Alps, Switzerland",
    duration: { days: 10, nights: 9 },
    price: { basePrice: 49999, currency: 'INR' },
    pricing: { adult: 49999, child: 37499, infant: 12499 },
    category: "Adventure",
    images: [
      { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500", caption: "Mountain View" },
      { url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=500", caption: "Alpine Trail" }
    ],
    inclusions: [
      "Mountain lodge accommodation",
      "Professional guide",
      "All meals",
      "Trekking equipment",
      "Cable car rides",
      "Travel insurance"
    ],
    exclusions: [
      "International flights",
      "Personal gear",
      "Alcoholic beverages",
      "Souvenirs"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Zurich", description: "Start your adventure", activities: ["Airport pickup", "City tour", "Equipment briefing"], meals: ["Dinner"] },
      { day: 2, title: "Zermatt Base", description: "Mountain base camp", activities: ["Train to Zermatt", "Matterhorn viewpoint", "Acclimatization hike"], meals: ["Breakfast", "Lunch", "Dinner"] }
    ],
    availability: {
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-09-30')
    },
    groupSize: { min: 4, max: 12 },
    isActive: true
  },
  {
    title: "Tokyo Cultural Experience",
    description: "Immerse yourself in Japanese culture with traditional temples, modern cities, and authentic cuisine.",
    destination: "Tokyo, Japan",
    duration: { days: 6, nights: 5 },
    price: { basePrice: 42999, currency: 'INR' },
    pricing: { adult: 42999, child: 32249, infant: 10749 },
    category: "Cultural",
    images: [
      { url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500", caption: "Tokyo Skyline" },
      { url: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=500", caption: "Traditional Temple" }
    ],
    inclusions: [
      "Boutique hotel stay",
      "JR Pass (7 days)",
      "Cultural workshops",
      "Temple visits",
      "Food tours",
      "English guide"
    ],
    exclusions: [
      "International flights",
      "Some meals",
      "Shopping expenses",
      "Optional activities"
    ],
    itinerary: [
      { day: 1, title: "Tokyo Arrival", description: "Welcome to Tokyo", activities: ["Shibuya crossing", "Harajuku district", "Welcome dinner"], meals: ["Dinner"] },
      { day: 2, title: "Traditional Tokyo", description: "Cultural immersion", activities: ["Senso-ji Temple", "Tea ceremony", "Sushi making class"], meals: ["Breakfast", "Lunch"] }
    ],
    availability: {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31')
    },
    groupSize: { min: 2, max: 15 },
    isActive: true
  },
  {
    title: "Maldives Beach Retreat",
    description: "Ultimate luxury beach vacation with crystal clear waters and overwater bungalows.",
    destination: "Maldives",
    duration: { days: 5, nights: 4 },
    price: { basePrice: 47999, currency: 'INR' },
    pricing: { adult: 47999, child: 35999, infant: 11999 },
    category: "Beach",
    images: [
      { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500", caption: "Overwater Villa" },
      { url: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=500", caption: "Crystal Waters" }
    ],
    inclusions: [
      "Overwater villa",
      "All meals included",
      "Spa treatments",
      "Water sports",
      "Sunset cruise",
      "Airport transfers"
    ],
    exclusions: [
      "International flights",
      "Alcoholic beverages",
      "Diving certification",
      "Personal expenses"
    ],
    itinerary: [
      { day: 1, title: "Paradise Arrival", description: "Welcome to paradise", activities: ["Seaplane transfer", "Villa check-in", "Beach relaxation"], meals: ["Lunch", "Dinner"] },
      { day: 2, title: "Water Adventures", description: "Ocean activities", activities: ["Snorkeling", "Kayaking", "Dolphin watching"], meals: ["Breakfast", "Lunch", "Dinner"] }
    ],
    availability: {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31')
    },
    groupSize: { min: 2, max: 8 },
    isActive: true
  },
  {
    title: "Paris Romantic Getaway",
    description: "Experience the city of love with romantic walks, fine dining, and iconic landmarks.",
    destination: "Paris, France",
    duration: { days: 4, nights: 3 },
    price: { basePrice: 39999, currency: 'INR' },
    pricing: { adult: 39999, child: 29999, infant: 9999 },
    category: "Honeymoon",
    images: [
      { url: "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=500", caption: "Eiffel Tower" },
      { url: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=500", caption: "Seine River" }
    ],
    inclusions: ["Luxury hotel", "Seine river cruise", "Eiffel Tower dinner", "City tours", "Airport transfers"],
    exclusions: ["International flights", "Shopping", "Extra meals", "Tips"],
    itinerary: [
      { day: 1, title: "Arrival in Paris", description: "Welcome to romance", activities: ["Hotel check-in", "Evening Seine cruise"], meals: ["Dinner"] },
      { day: 2, title: "City of Lights", description: "Iconic landmarks", activities: ["Eiffel Tower", "Louvre Museum", "Champs-Élysées"], meals: ["Breakfast"] }
    ],
    availability: { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31') },
    groupSize: { min: 2, max: 10 },
    isActive: true
  },
  {
    title: "African Safari Adventure",
    description: "Witness the Big Five in their natural habitat across Kenya's premier national parks.",
    destination: "Kenya, Africa",
    duration: { days: 8, nights: 7 },
    price: { basePrice: 44999, currency: 'INR' },
    pricing: { adult: 44999, child: 33749, infant: 11249 },
    category: "Wildlife",
    images: [
      { url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500", caption: "Safari Wildlife" },
      { url: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=500", caption: "Savanna Sunset" }
    ],
    inclusions: ["Safari lodge accommodation", "Game drives", "Professional guide", "All meals", "Park fees"],
    exclusions: ["International flights", "Visa fees", "Travel insurance", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Nairobi Arrival", description: "Safari begins", activities: ["Airport pickup", "City briefing"], meals: ["Dinner"] },
      { day: 2, title: "Masai Mara", description: "Big Five hunting", activities: ["Morning game drive", "Afternoon safari"], meals: ["Breakfast", "Lunch", "Dinner"] }
    ],
    availability: { startDate: new Date('2024-06-01'), endDate: new Date('2024-10-31') },
    groupSize: { min: 2, max: 8 },
    isActive: true
  },
  {
    title: "New York City Explorer",
    description: "Discover the Big Apple with Broadway shows, world-class museums, and iconic skylines.",
    destination: "New York, USA",
    duration: { days: 5, nights: 4 },
    price: { basePrice: 41999, currency: 'INR' },
    pricing: { adult: 41999, child: 31499, infant: 10499 },
    category: "Cultural",
    images: [
      { url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500", caption: "NYC Skyline" },
      { url: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=500", caption: "Times Square" }
    ],
    inclusions: ["Manhattan hotel", "Broadway show tickets", "Museum passes", "City tour", "Subway passes"],
    exclusions: ["Flights", "Most meals", "Shopping", "Tips"],
    itinerary: [
      { day: 1, title: "Manhattan Arrival", description: "City that never sleeps", activities: ["Times Square", "Central Park walk"], meals: ["Welcome dinner"] },
      { day: 2, title: "Cultural Day", description: "Museums and shows", activities: ["MoMA visit", "Broadway show"], meals: ["Breakfast"] }
    ],
    availability: { startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31') },
    groupSize: { min: 1, max: 15 },
    isActive: true
  },
  {
    title: "Himalayan Trekking Expedition",
    description: "Challenge yourself with breathtaking mountain views and ancient Buddhist culture.",
    destination: "Nepal Himalayas",
    duration: { days: 14, nights: 13 },
    price: { basePrice: 46999, currency: 'INR' },
    pricing: { adult: 46999, child: 35249, infant: 11749 },
    category: "Adventure",
    images: [
      { url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500", caption: "Mountain Peaks" },
      { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500", caption: "Trekking Trail" }
    ],
    inclusions: ["Teahouse accommodation", "Trekking permits", "Professional guide", "Porter service", "All meals during trek"],
    exclusions: ["International flights", "Kathmandu hotels", "Personal gear", "Travel insurance"],
    itinerary: [
      { day: 1, title: "Kathmandu Arrival", description: "Trek preparation", activities: ["Gear check", "Briefing session"], meals: ["Dinner"] },
      { day: 2, title: "Trek Begins", description: "Into the mountains", activities: ["Flight to Lukla", "Trek to Namche"], meals: ["Breakfast", "Lunch", "Dinner"] }
    ],
    availability: { startDate: new Date('2024-03-01'), endDate: new Date('2024-11-30') },
    groupSize: { min: 2, max: 12 },
    isActive: true
  },
  {
    title: "Greek Island Hopping",
    description: "Explore the stunning Greek islands with crystal blue waters and ancient history.",
    destination: "Greek Islands",
    duration: { days: 9, nights: 8 },
    price: { basePrice: 43999, currency: 'INR' },
    pricing: { adult: 43999, child: 32999, infant: 10999 },
    category: "Beach",
    images: [
      { url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=500", caption: "Santorini Sunset" },
      { url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500", caption: "Mykonos Beach" }
    ],
    inclusions: ["Island accommodation", "Ferry transfers", "Guided tours", "Some meals", "Airport transfers"],
    exclusions: ["International flights", "Most meals", "Personal expenses", "Optional activities"],
    itinerary: [
      { day: 1, title: "Athens Arrival", description: "Ancient meets modern", activities: ["Acropolis visit", "City tour"], meals: ["Dinner"] },
      { day: 2, title: "Santorini", description: "Volcanic beauty", activities: ["Ferry to Santorini", "Sunset viewing"], meals: ["Breakfast"] }
    ],
    availability: { startDate: new Date('2024-04-01'), endDate: new Date('2024-10-31') },
    groupSize: { min: 2, max: 16 },
    isActive: true
  }
];

async function seedPackages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Package.deleteMany({});
    console.log('Cleared existing packages');

    const packages = await Package.insertMany(samplePackages);
    console.log(`Inserted ${packages.length} packages`);
    
    // Display inserted packages for verification
    packages.forEach(pkg => {
      console.log(`- ${pkg.title} (${pkg.destination}) - $${pkg.pricing.adult}`);
    });

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedPackages();