// AI Travel Assistant Service
class TravelAI {
  constructor() {
    this.context = {
      userName: null,
      preferences: {},
      conversationHistory: []
    };
  }

  // Main AI response generator
  async generateResponse(userInput, navigate) {
    const input = userInput.toLowerCase().trim();
    
    // Store conversation
    this.context.conversationHistory.push({ user: userInput, timestamp: Date.now() });
    
    // Check for navigation commands first
    const navResponse = this.handleNavigation(input, navigate);
    if (navResponse) return navResponse;
    
    // Check if input is a destination name
    const destination = this.detectDestination(input);
    if (destination) {
      return this.handleSpecificDestination(destination);
    }
    
    // Handle different types of queries
    if (this.isGreeting(input)) {
      return this.handleGreeting(input);
    }
    
    if (this.isBudgetQuery(input)) {
      return this.handleBudgetQuery(input);
    }
    
    if (this.isDestinationQuery(input)) {
      return this.handleDestinationQuery(input);
    }
    
    if (this.isTravelAdvice(input)) {
      return this.handleTravelAdvice(input);
    }
    
    if (this.isWeatherQuery(input)) {
      return this.handleWeatherQuery(input);
    }
    
    if (this.isPersonalQuery(input)) {
      return this.handlePersonalQuery(input);
    }
    
    // Default conversational response
    return this.handleGeneralConversation(input);
  }

  isGreeting(input) {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon'];
    return greetings.some(greeting => input.includes(greeting));
  }

  isBudgetQuery(input) {
    const budgetKeywords = ['budget', 'cost', 'price', 'money', 'expensive', 'cheap', 'affordable'];
    return budgetKeywords.some(keyword => input.includes(keyword));
  }

  isDestinationQuery(input) {
    const destKeywords = ['destination', 'place', 'country', 'city', 'visit', 'travel to', 'go to'];
    return destKeywords.some(keyword => input.includes(keyword));
  }

  isTravelAdvice(input) {
    const adviceKeywords = ['suggest', 'recommend', 'advice', 'tips', 'best time', 'when to', 'how to'];
    return adviceKeywords.some(keyword => input.includes(keyword));
  }

  isWeatherQuery(input) {
    const weatherKeywords = ['weather', 'climate', 'temperature', 'rain', 'season'];
    return weatherKeywords.some(keyword => input.includes(keyword));
  }

  isPersonalQuery(input) {
    const personalKeywords = ['who are you', 'what are you', 'your name', 'about you'];
    return personalKeywords.some(keyword => input.includes(keyword));
  }

  handleNavigation(input, navigate) {
    if (input.includes('home') || input.includes('homepage')) {
      navigate('/');
      return 'Taking you to the home page! 🏠';
    }
    
    if (input.includes('destination') && !input.includes('search')) {
      navigate('/destinations');
      return 'Opening our destinations page! ✈️';
    }
    
    if (input.includes('testimonial') || input.includes('review')) {
      navigate('/testimonials');
      return 'Here are what our travelers say! 💬';
    }
    
    if (input.includes('feature')) {
      navigate('/features');
      return 'Check out our amazing features! ⭐';
    }

    if (input.includes('search') || input.includes('find') || input.includes('look for')) {
      const searchTerms = input
        .replace(/search|find|look for|about|destination|place/g, '')
        .trim();
      
      if (searchTerms) {
        navigate(`/destinations?search=${encodeURIComponent(searchTerms)}`);
        return `Searching for "${searchTerms}" destinations! 🔍`;
      }
    }
    
    return null;
  }

  handleGreeting(input) {
    const responses = [
      "Hello! I'm your AI travel assistant! 😊 I'm here to help you plan amazing trips. What's on your travel wishlist?",
      "Hi there! Ready for your next adventure? I can help with destinations, budgets, and travel tips! 🌍",
      "Hey! Great to meet you! I'm excited to help you discover incredible places. Where would you like to explore?",
      "Hello traveler! I'm here to make your travel dreams come true. Ask me anything about destinations, costs, or travel advice! ✈️"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  handleBudgetQuery(input) {
    if (input.includes('budget for') || input.includes('cost of')) {
      const destination = this.extractDestination(input);
      if (destination) {
        return this.getBudgetAdvice(destination);
      }
    }
    
    // Check if user mentioned a specific destination with budget context
    const destination = this.detectDestination(input);
    if (destination) {
      return this.getBudgetAdvice(destination);
    }
    
    if (input.includes('cheap') || input.includes('affordable')) {
      return `For budget travel, I recommend:
💰 Southeast Asia (Thailand, Vietnam) - ₹25,000-35,000 for 7 days
💰 India domestic (Goa, Rajasthan) - ₹15,000-25,000 for 5 days  
💰 Nepal (Kathmandu, Pokhara) - ₹20,000-30,000 for 6 days
💰 Eastern Europe (Prague, Budapest) - ₹40,000-50,000 for 7 days

Would you like detailed budget breakdown for any destination?`;
    }

    return `I'd love to help with budget planning! 💰 
Travel costs vary by:
• Destination (domestic vs international)
• Season (peak vs off-season)
• Accommodation type (budget to luxury)
• Activities and experiences

What's your approximate budget range? I can suggest perfect destinations for you!`;
  }

  handleDestinationQuery(input) {
    if (input.includes('romantic') || input.includes('honeymoon')) {
      return `Perfect romantic destinations! 💕
🌅 Santorini, Greece - Stunning sunsets, ₹80,000-1,20,000
🏝️ Maldives - Overwater villas, ₹1,50,000-3,00,000  
🏔️ Swiss Alps - Mountain romance, ₹1,00,000-1,50,000
🌸 Udaipur, India - Palace hotels, ₹25,000-50,000
🏖️ Bali, Indonesia - Beach & culture, ₹40,000-70,000

Which style appeals to you more - beach, mountains, or cultural?`;
    }

    if (input.includes('adventure') || input.includes('trekking')) {
      return `Adventure awaits! 🏔️
🥾 Leh-Ladakh - High altitude trekking, ₹35,000-50,000
🏔️ Nepal Himalayas - Everest base camp, ₹60,000-80,000
🌋 New Zealand - Bungee & skydiving, ₹1,20,000-1,80,000
🏞️ Rishikesh - River rafting & yoga, ₹15,000-25,000
🏕️ Manali - Paragliding & camping, ₹20,000-35,000

What type of adventure excites you most?`;
    }

    if (input.includes('family') || input.includes('kids')) {
      return `Family-friendly destinations! 👨‍👩‍👧‍👦
🎢 Dubai - Theme parks & beaches, ₹60,000-90,000
🏰 Singapore - Universal Studios, ₹70,000-1,00,000
🐘 Kerala - Backwaters & wildlife, ₹30,000-45,000
🏖️ Goa - Beaches & water sports, ₹25,000-40,000
🎪 Thailand - Elephant parks & islands, ₹45,000-65,000

How many family members? I can suggest perfect itineraries!`;
    }

    return `I'd love to help you find the perfect destination! 🌍
Tell me more about what you're looking for:
• Beach relaxation or mountain adventure?
• Cultural experiences or modern cities?
• Budget range and travel dates?
• Solo, couple, or family trip?

The more you tell me, the better I can personalize recommendations!`;
  }

  handleTravelAdvice(input) {
    if (input.includes('best time')) {
      return `Best travel times by destination! 📅
🌸 Japan (Cherry blossoms): March-May
🏔️ Himalayas: March-May, Sept-Nov  
🏖️ Maldives: Nov-April (dry season)
🌞 Europe: May-September
🍂 India (North): Oct-March
❄️ Switzerland: Dec-March (skiing)

Which destination interests you? I'll give detailed seasonal advice!`;
    }

    if (input.includes('packing') || input.includes('what to carry')) {
      return `Smart packing tips! 🎒
✈️ Essentials for any trip:
• Valid passport & visa documents
• Travel insurance & emergency contacts
• Universal adapter & power bank
• First aid kit & personal medicines
• Comfortable walking shoes

📍 Destination-specific items:
• Beach: Sunscreen, swimwear, flip-flops
• Mountains: Warm clothes, trekking shoes
• Cities: Formal clothes, comfortable shoes

Where are you planning to go? I'll create a custom packing list!`;
    }

    return `I'm full of travel wisdom! 🧳 Ask me about:
• Best times to visit destinations
• Packing essentials & tips  
• Local customs & etiquette
• Transportation options
• Food & safety advice
• Photography spots
• Money-saving hacks

What specific travel advice do you need?`;
  }

  handleWeatherQuery(input) {
    return `Weather planning is crucial! 🌤️
🌡️ Current season considerations:
• Tropical destinations: Check monsoon patterns
• Mountain regions: Temperature drops with altitude  
• Desert areas: Extreme day/night temperature differences
• Coastal areas: Humidity and sea breeze factors

Which destination's weather are you curious about? I can provide:
• Monthly temperature ranges
• Rainfall patterns  
• Best weather windows
• What to pack for the climate`;
  }

  handlePersonalQuery(input) {
    return `I'm your AI travel companion! 🤖✈️
I'm designed to be your personal travel expert, helping with:
• Destination recommendations based on your preferences
• Budget planning and cost breakdowns
• Travel tips and local insights  
• Itinerary suggestions
• Weather and seasonal advice
• Cultural information

I learn from our conversation to give you personalized suggestions. Think of me as your knowledgeable travel friend who's been everywhere! 

What would you like to explore together?`;
  }

  handleSpecificDestination(destination) {
    const destinationInfo = {
      'canada': `Canada is amazing! 🇨🇦 Here's what I recommend:
🏔️ **Best Places:** Vancouver, Toronto, Banff National Park, Niagara Falls
💰 **Budget:** ₹80,000-1,20,000 for 7 days
🌡️ **Best Time:** May-September (summer), Dec-March (winter sports)
✈️ **Highlights:** Rocky Mountains, maple syrup tours, Northern Lights
🏨 **Tips:** Book early for summer, try poutine and maple cookies!

What specifically interests you about Canada - nature, cities, or winter activities?`,
      
      'paris': `Paris - the City of Light! 🇫🇷✨
🗼 **Must-See:** Eiffel Tower, Louvre, Notre-Dame, Champs-Élysées
💰 **Budget:** ₹70,000-1,10,000 for 5 days
🌡️ **Best Time:** April-June, September-October
🥐 **Food:** Croissants, macarons, wine tasting
💡 **Tips:** Buy museum passes, walk along Seine River

Are you interested in art, food, or romantic experiences in Paris?`,
      
      'tokyo': `Tokyo is incredible! 🇯🇵🏙️
🌸 **Highlights:** Shibuya Crossing, Senso-ji Temple, Harajuku, Mount Fuji day trip
💰 **Budget:** ₹85,000-1,30,000 for 6 days
🌡️ **Best Time:** March-May (cherry blossoms), September-November
🍣 **Food:** Sushi, ramen, street food in Tsukiji
🚄 **Tips:** Get JR Pass, learn basic Japanese phrases

What excites you most - traditional culture, modern city life, or food?`,
      
      'bali': `Bali is paradise! 🇮🇩🏝️
🌺 **Best Areas:** Ubud (culture), Seminyak (beaches), Canggu (surfing)
💰 **Budget:** ₹35,000-55,000 for 7 days
🌡️ **Best Time:** April-October (dry season)
🏛️ **Activities:** Temple visits, rice terraces, volcano hiking
🏄 **Tips:** Rent a scooter, try local warungs, book spa treatments

Are you more interested in beaches, culture, or adventure activities?`
    };
    
    return destinationInfo[destination] || `${destination.charAt(0).toUpperCase() + destination.slice(1)} sounds like a great choice! 🌍 Let me help you plan:

💰 I can provide budget estimates
📅 Best travel times and weather info
🎯 Top attractions and hidden gems
🍽️ Local food recommendations
🏨 Accommodation suggestions

What would you like to know about ${destination}?`;
  }

  handleGeneralConversation(input) {
    const responses = [
      "That's interesting! Tell me more about your travel preferences - are you looking for adventure, relaxation, or cultural experiences? 🌟",
      "I love helping with travel planning! What's your ideal vacation like - beaches, mountains, cities, or something else? 🗺️",
      "Every trip is unique! What kind of experiences make you most excited when traveling? ✈️",
      "Travel planning is my favorite topic! What's your budget range and dream destination type? 🌍"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  detectDestination(input) {
    const destinations = {
      'canada': 'canada',
      'paris': 'paris', 
      'france': 'paris',
      'tokyo': 'tokyo',
      'japan': 'tokyo',
      'bali': 'bali',
      'indonesia': 'bali',
      'new york': 'new york',
      'nyc': 'new york',
      'usa': 'usa',
      'america': 'usa',
      'london': 'london',
      'uk': 'london',
      'england': 'london',
      'dubai': 'dubai',
      'uae': 'dubai',
      'maldives': 'maldives',
      'thailand': 'thailand',
      'bangkok': 'thailand',
      'phuket': 'thailand',
      'india': 'india',
      'goa': 'goa',
      'kerala': 'kerala',
      'rajasthan': 'rajasthan',
      'switzerland': 'switzerland',
      'swiss': 'switzerland',
      'italy': 'italy',
      'rome': 'italy',
      'spain': 'spain',
      'barcelona': 'spain',
      'australia': 'australia',
      'sydney': 'australia',
      'singapore': 'singapore',
      'china': 'china',
      'beijing': 'china',
      'germany': 'germany',
      'berlin': 'germany',
      'brazil': 'brazil',
      'rio': 'brazil'
    };
    
    for (const [key, value] of Object.entries(destinations)) {
      if (input.includes(key)) {
        return value;
      }
    }
    return null;
  }

  extractDestination(input) {
    return this.detectDestination(input);
  }

  getBudgetAdvice(destination) {
    const budgets = {
      'canada': 'Canada budget: ₹80,000-1,20,000 for 7 days including flights, hotels, meals. Summer is peak season, winter offers better deals!',
      'paris': 'Paris budget: ₹70,000-1,10,000 for 5 days including flights, hotels, meals, and sightseeing. Best deals in off-season (Nov-Mar)!',
      'tokyo': 'Tokyo budget: ₹85,000-1,30,000 for 6 days. Save money with JR Pass, convenience store meals, and capsule hotels!',
      'bali': 'Bali budget: ₹35,000-55,000 for 7 days. Great value destination with affordable accommodation and food!',
      'goa': 'Goa budget: ₹15,000-30,000 for 5 days. Perfect for budget travelers with cheap stays and delicious local food!',
      'dubai': 'Dubai budget: ₹50,000-90,000 for 5 days. Mix of luxury and budget options available!',
      'thailand': 'Thailand budget: ₹40,000-65,000 for 7 days. Very affordable with great street food and budget accommodations!',
      'switzerland': 'Switzerland budget: ₹1,00,000-1,50,000 for 6 days. Expensive but worth it! Use Swiss Travel Pass for savings.',
      'usa': 'USA budget varies by city: ₹80,000-1,40,000 for 7 days. New York/LA are pricier than other cities.',
      'australia': 'Australia budget: ₹90,000-1,40,000 for 8 days. Book flights early and consider working holiday visa for longer stays.'
    };
    return budgets[destination] || `I'd love to help with ${destination} budget planning! What's your travel style - budget, mid-range, or luxury?`;
  }
}

export default new TravelAI();