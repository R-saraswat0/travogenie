// Enhanced AI Service with real APIs
class EnhancedAI {
  constructor() {
    this.context = {
      conversationHistory: [],
      userPreferences: {}
    };
    
    // Fallback responses for when APIs are unavailable
    this.fallbackResponses = {
      greeting: "Hello! I'm your AI travel assistant. I can help with destinations, budgets, and travel planning!",
      error: "I'm having trouble connecting right now, but I can still help with basic travel questions!"
    };
  }

  async generateResponse(userInput, navigate) {
    try {
      // Store conversation
      this.context.conversationHistory.push({
        user: userInput,
        timestamp: Date.now()
      });

      // Check for navigation commands first
      const navResponse = this.handleNavigation(userInput, navigate);
      if (navResponse) return navResponse;

      // Try to get AI response
      const aiResponse = await this.getAIResponse(userInput);
      if (aiResponse) return aiResponse;

      // Fallback to rule-based responses
      return this.getRuleBasedResponse(userInput);
      
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.fallbackResponses.error;
    }
  }

  async getAIResponse(userInput) {
    try {
      // Simulate OpenAI API call (replace with real API key)
      const response = await this.callOpenAI(userInput);
      if (response) return response;
      
      // Try Gemini API as backup
      const geminiResponse = await this.callGemini(userInput);
      if (geminiResponse) return geminiResponse;
      
      return null;
    } catch (error) {
      console.error('AI API Error:', error);
      return null;
    }
  }

  async callOpenAI(userInput) {
    try {
      // Use environment variable for API key
      const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
      
      if (!API_KEY) {
        return null; // Skip if no API key
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a helpful travel assistant for a travel booking website. Help users with:
              - Destination recommendations
              - Budget planning (use Indian Rupees ₹)
              - Travel tips and advice
              - Best times to visit places
              - Local attractions and activities
              
              Keep responses friendly, informative, and under 200 words. Use emojis appropriately.
              If asked about navigation, politely redirect to travel topics.`
            },
            {
              role: 'user',
              content: userInput
            }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices[0]?.message?.content;
      }
      
      return null;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return null;
    }
  }

  async callGemini(userInput) {
    try {
      // Use environment variable for API key
      const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
      
      if (!API_KEY) {
        return null; // Skip if no API key
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a travel assistant. Help with travel planning, destinations, budgets (in Indian Rupees ₹), and tips. Keep responses under 200 words and friendly. User query: ${userInput}`
            }]
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.candidates[0]?.content?.parts[0]?.text;
      }
      
      return null;
    } catch (error) {
      console.error('Gemini API Error:', error);
      return null;
    }
  }

  handleNavigation(input, navigate) {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('home') || lowerInput.includes('homepage')) {
      navigate('/');
      return 'Taking you to the home page! 🏠';
    }
    
    if (lowerInput.includes('destination') && !lowerInput.includes('search')) {
      navigate('/destinations');
      return 'Opening our destinations page! ✈️';
    }
    
    if (lowerInput.includes('testimonial') || lowerInput.includes('review')) {
      navigate('/testimonials');
      return 'Here are what our travelers say! 💬';
    }
    
    if (lowerInput.includes('feature')) {
      navigate('/features');
      return 'Check out our amazing features! ⭐';
    }

    if (lowerInput.includes('search') || lowerInput.includes('find')) {
      const searchTerms = lowerInput
        .replace(/search|find|look for|about|destination|place/g, '')
        .trim();
      
      if (searchTerms) {
        navigate(`/destinations?search=${encodeURIComponent(searchTerms)}`);
        return `Searching for "${searchTerms}" destinations! 🔍`;
      }
    }
    
    return null;
  }

  getRuleBasedResponse(userInput) {
    const input = userInput.toLowerCase();
    
    // Greetings
    if (this.isGreeting(input)) {
      return "Hello! I'm your AI travel companion! 🌍 I can help you plan trips, suggest destinations, create budgets, and give travel advice. What's your next adventure?";
    }
    
    // Destination queries
    if (this.containsDestination(input)) {
      return this.getDestinationInfo(input);
    }
    
    // Budget queries
    if (this.isBudgetQuery(input)) {
      return this.getBudgetAdvice(input);
    }
    
    // Travel advice
    if (this.isTravelAdvice(input)) {
      return this.getTravelTips(input);
    }
    
    // Default response
    return "I'd love to help you with your travel plans! 🌟 You can ask me about:\n• Destination recommendations\n• Budget planning\n• Best travel times\n• Travel tips and advice\n• Local attractions\n\nWhat would you like to know?";
  }

  isGreeting(input) {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good evening'];
    return greetings.some(greeting => input.includes(greeting));
  }

  containsDestination(input) {
    const destinations = ['paris', 'tokyo', 'bali', 'canada', 'australia', 'singapore', 'thailand', 'india', 'goa', 'dubai', 'maldives', 'switzerland', 'italy', 'spain', 'london', 'new york'];
    return destinations.some(dest => input.includes(dest));
  }

  isBudgetQuery(input) {
    const budgetKeywords = ['budget', 'cost', 'price', 'money', 'expensive', 'cheap', 'affordable'];
    return budgetKeywords.some(keyword => input.includes(keyword));
  }

  isTravelAdvice(input) {
    const adviceKeywords = ['suggest', 'recommend', 'advice', 'tips', 'best time', 'when to'];
    return adviceKeywords.some(keyword => input.includes(keyword));
  }

  getDestinationInfo(input) {
    if (input.includes('canada')) {
      return "Canada is amazing! 🇨🇦\n🏔️ **Highlights:** Banff, Toronto, Vancouver, Niagara Falls\n💰 **Budget:** ₹80,000-1,20,000 for 7 days\n🌡️ **Best Time:** May-September\n✨ **Tips:** Try maple syrup, see Northern Lights, explore Rocky Mountains!\n\nWhat specifically interests you about Canada?";
    }
    
    if (input.includes('paris')) {
      return "Paris - City of Light! 🇫🇷✨\n🗼 **Must-See:** Eiffel Tower, Louvre, Notre-Dame\n💰 **Budget:** ₹70,000-1,10,000 for 5 days\n🌡️ **Best Time:** April-June, September-October\n🥐 **Food:** Croissants, macarons, wine\n\nInterested in art, food, or romance in Paris?";
    }
    
    if (input.includes('bali')) {
      return "Bali is paradise! 🇮🇩🏝️\n🌺 **Areas:** Ubud (culture), Seminyak (beaches)\n💰 **Budget:** ₹35,000-55,000 for 7 days\n🌡️ **Best Time:** April-October\n🏛️ **Activities:** Temples, rice terraces, surfing\n\nBeaches, culture, or adventure in Bali?";
    }
    
    return "That destination sounds exciting! 🌍 I can help you with budget planning, best travel times, top attractions, and local tips. What would you like to know?";
  }

  getBudgetAdvice(input) {
    if (input.includes('cheap') || input.includes('budget')) {
      return "Budget-friendly destinations! 💰\n🌏 **Southeast Asia:** Thailand, Vietnam - ₹25,000-35,000\n🇮🇳 **India:** Goa, Rajasthan - ₹15,000-25,000\n🏔️ **Nepal:** Kathmandu, Pokhara - ₹20,000-30,000\n🏰 **Eastern Europe:** Prague, Budapest - ₹40,000-50,000\n\nWhat's your budget range?";
    }
    
    return "I'd love to help with budget planning! 💰\nCosts depend on:\n• Destination choice\n• Travel season\n• Accommodation type\n• Activities planned\n\nWhat's your approximate budget? I can suggest perfect destinations!";
  }

  getTravelTips(input) {
    if (input.includes('packing')) {
      return "Smart packing tips! 🎒\n✈️ **Essentials:**\n• Passport & visa documents\n• Travel insurance\n• Universal adapter\n• First aid kit\n• Comfortable shoes\n\n📍 **Destination-specific:**\n• Beach: Sunscreen, swimwear\n• Mountains: Warm clothes, boots\n• Cities: Formal wear, walking shoes\n\nWhere are you traveling?";
    }
    
    return "Travel wisdom! 🧳\nI can help with:\n• Best times to visit\n• Packing essentials\n• Local customs\n• Transportation tips\n• Food recommendations\n• Safety advice\n• Money-saving hacks\n\nWhat specific advice do you need?";
  }
}

export default new EnhancedAI();