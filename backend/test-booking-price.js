const mongoose = require('mongoose');
const Package = require('./models/Package');

async function testBookingPrice() {
  try {
    await mongoose.connect('mongodb://localhost:27017/travogenie');
    console.log('Connected to MongoDB');
    
    // Get first package
    const package = await Package.findOne();
    console.log('\n📦 Package Details:');
    console.log('Title:', package.title);
    console.log('Adult Price:', package.pricing.adult);
    console.log('Child Price:', package.pricing.child);
    console.log('Infant Price:', package.pricing.infant);
    
    // Simulate frontend calculation
    const guests = { adults: 1, children: 0, infants: 0 };
    const nights = 1;
    const packageNights = package.duration?.nights || 1;
    const nightMultiplier = nights / packageNights;
    
    const basePrice = (package.pricing?.adult || 0) * guests.adults * nightMultiplier;
    const childPrice = (package.pricing?.child || 0) * guests.children * nightMultiplier;
    const infantPrice = (package.pricing?.infant || 0) * guests.infants * nightMultiplier;
    
    const totalPrice = Math.round(basePrice + childPrice + infantPrice);
    
    console.log('\n💰 Price Calculation:');
    console.log('Package Nights:', packageNights);
    console.log('Selected Nights:', nights);
    console.log('Night Multiplier:', nightMultiplier);
    console.log('Base Price (Adults):', basePrice);
    console.log('Child Price:', childPrice);
    console.log('Infant Price:', infantPrice);
    console.log('Total Price:', totalPrice);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testBookingPrice();