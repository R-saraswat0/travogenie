import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaMicrophone, FaMicrophoneSlash, FaPaperPlane, FaTimes, FaVolumeUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! I\'m your AI travel assistant! 🌍 Ask me about destinations, budgets, travel tips, or anything travel-related!' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }

    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  const speak = (text) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      synthRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const getAIResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    // Navigation commands
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
      const searchTerms = lowerInput.replace(/search|find|look for|about|destination|place/g, '').trim();
      if (searchTerms) {
        navigate(`/destinations?search=${encodeURIComponent(searchTerms)}`);
        return `Searching for "${searchTerms}" destinations! 🔍`;
      }
    }

    // Greetings
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return 'Hello! 😊 I\'m excited to help you plan your next adventure! What destination are you dreaming about?';
    }

    // Specific destinations
    if (lowerInput.includes('canada')) {
      return `Canada is incredible! 🇨🇦\n\n🏔️ **Must Visit:** Banff, Toronto, Vancouver, Niagara Falls\n💰 **Budget:** ₹80,000-1,20,000 for 7 days\n🌡️ **Best Time:** May-September (summer)\n❄️ **Winter:** December-March for skiing\n🍁 **Highlights:** Rocky Mountains, maple syrup, Northern Lights\n\nWhat interests you most - nature, cities, or winter sports?`;
    }

    if (lowerInput.includes('paris')) {
      return `Paris - City of Light! 🇫🇷✨\n\n🗼 **Icons:** Eiffel Tower, Louvre, Notre-Dame\n💰 **Budget:** ₹70,000-1,10,000 for 5 days\n🌡️ **Best Time:** April-June, September-October\n🥐 **Food:** Croissants, macarons, wine\n🎨 **Culture:** Museums, cafes, Seine walks\n\nInterested in art, food, or romantic experiences?`;
    }

    if (lowerInput.includes('bali')) {
      return `Bali is paradise! 🇮🇩🏝️\n\n🌺 **Areas:** Ubud (culture), Seminyak (beaches), Canggu (surfing)\n💰 **Budget:** ₹35,000-55,000 for 7 days\n🌡️ **Best Time:** April-October (dry season)\n🏛️ **Activities:** Temples, rice terraces, volcano hiking\n🏄 **Adventure:** Surfing, diving, jungle trekking\n\nBeaches, culture, or adventure - what calls to you?`;
    }

    if (lowerInput.includes('tokyo') || lowerInput.includes('japan')) {
      return `Tokyo is amazing! 🇯🇵🏙️\n\n🌸 **Highlights:** Shibuya, Senso-ji Temple, Harajuku, Mount Fuji\n💰 **Budget:** ₹85,000-1,30,000 for 6 days\n🌡️ **Best Time:** March-May (cherry blossoms), Sept-Nov\n🍣 **Food:** Sushi, ramen, street food\n🚄 **Transport:** JR Pass for trains\n\nTraditional culture, modern city, or food experiences?`;
    }

    if (lowerInput.includes('dubai')) {
      return `Dubai is luxury! 🇦🇪✨\n\n🏗️ **Icons:** Burj Khalifa, Palm Jumeirah, Dubai Mall\n💰 **Budget:** ₹50,000-90,000 for 5 days\n🌡️ **Best Time:** November-March (cooler weather)\n🏖️ **Activities:** Desert safari, beaches, shopping\n🎢 **Fun:** Theme parks, luxury experiences\n\nLuxury, adventure, or family fun in Dubai?`;
    }

    if (lowerInput.includes('thailand')) {
      return `Thailand is incredible! 🇹🇭🌴\n\n🏝️ **Islands:** Phuket, Koh Phi Phi, Koh Samui\n🏛️ **Culture:** Bangkok temples, Chiang Mai\n💰 **Budget:** ₹40,000-65,000 for 7 days\n🌡️ **Best Time:** November-March (cool season)\n🍜 **Food:** Pad Thai, Tom Yum, street food\n\nBeaches, culture, or food adventures?`;
    }

    if (lowerInput.includes('goa')) {
      return `Goa is perfect! 🇮🇳🏖️\n\n🏖️ **Beaches:** Baga, Anjuna, Calangute, Palolem\n💰 **Budget:** ₹15,000-30,000 for 5 days\n🌡️ **Best Time:** October-March\n🎉 **Vibes:** Beach parties, Portuguese heritage\n🍤 **Food:** Seafood, feni, beach shacks\n\nParty beaches or peaceful retreats?`;
    }

    // Budget queries
    if (lowerInput.includes('budget') || lowerInput.includes('cost') || lowerInput.includes('price')) {
      return `Budget planning made easy! 💰\n\n**Budget Destinations:**\n🌏 Southeast Asia: ₹25,000-40,000\n🇮🇳 India domestic: ₹15,000-30,000\n🏰 Eastern Europe: ₹40,000-60,000\n\n**Mid-range:**\n🇪🇺 Western Europe: ₹70,000-1,20,000\n🇯🇵 Japan/Korea: ₹80,000-1,30,000\n\n**Luxury:**\n🏝️ Maldives: ₹1,50,000+\n🇨🇭 Switzerland: ₹1,20,000+\n\nWhat's your budget range?`;
    }

    // Travel advice
    if (lowerInput.includes('suggest') || lowerInput.includes('recommend')) {
      if (lowerInput.includes('romantic') || lowerInput.includes('honeymoon')) {
        return `Romantic destinations! 💕\n\n🌅 **Santorini, Greece** - Stunning sunsets\n🏝️ **Maldives** - Overwater villas\n🏔️ **Swiss Alps** - Mountain romance\n🌸 **Udaipur, India** - Palace hotels\n🏖️ **Bali** - Beach & culture\n🗼 **Paris** - City of love\n\nBeach romance or mountain magic?`;
      }
      
      if (lowerInput.includes('adventure')) {
        return `Adventure awaits! 🏔️\n\n🥾 **Leh-Ladakh** - High altitude trekking\n🏔️ **Nepal** - Everest base camp\n🌋 **New Zealand** - Bungee & skydiving\n🏞️ **Rishikesh** - River rafting\n🏕️ **Manali** - Paragliding\n🏜️ **Dubai** - Desert safari\n\nMountains, water sports, or extreme adventures?`;
      }

      return `I'd love to suggest destinations! 🌍\n\nTell me about:\n• Your budget range\n• Preferred activities (beach, culture, adventure)\n• Travel dates/season\n• Group size (solo, couple, family)\n• Duration of trip\n\nThe more you share, the better I can help!`;
    }

    // Weather queries
    if (lowerInput.includes('weather') || lowerInput.includes('climate')) {
      return `Weather planning is key! 🌤️\n\n**Current Season Tips:**\n🌸 **Spring (Mar-May):** Great for Japan, Europe\n☀️ **Summer (Jun-Aug):** Perfect for Europe, Canada\n🍂 **Autumn (Sep-Nov):** Ideal for India, Southeast Asia\n❄️ **Winter (Dec-Feb):** Best for tropical destinations\n\nWhich destination's weather interests you?`;
    }

    // Packing advice
    if (lowerInput.includes('pack') || lowerInput.includes('carry')) {
      return `Smart packing tips! 🎒\n\n**Essentials:**\n📄 Passport & visa documents\n💊 Medicines & first aid\n🔌 Universal adapter\n👟 Comfortable walking shoes\n📱 Power bank\n\n**Climate-specific:**\n🏖️ **Beach:** Sunscreen, swimwear\n🏔️ **Mountains:** Warm layers, boots\n🏙️ **Cities:** Formal clothes, comfortable shoes\n\nWhere are you traveling?`;
    }

    // Help queries
    if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
      return `I'm your travel expert! 🌟\n\n**I can help with:**\n✈️ Destination recommendations\n💰 Budget planning & costs\n📅 Best travel times\n🎒 Packing advice\n🏨 Accommodation tips\n🍽️ Food recommendations\n🚗 Transportation options\n📱 Navigation assistance\n\nWhat would you like to explore?`;
    }

    // Default responses for general queries
    const responses = [
      `That's interesting! 🌟 I'd love to help you plan something amazing. Are you thinking about a specific destination or type of trip?`,
      `Tell me more! 🗺️ What kind of travel experience are you looking for - relaxation, adventure, culture, or something else?`,
      `I'm excited to help! ✈️ What's your dream destination or what type of trip interests you most?`,
      `Great question! 🌍 Let me know your travel preferences and I'll suggest perfect destinations for you!`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleMessage = async (text) => {
    if (!text.trim()) return;

    setIsProcessing(true);
    
    // Add user message
    const userMessage = { type: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    
    // Get AI response
    setTimeout(() => {
      const response = getAIResponse(text);
      const botMessage = { type: 'bot', text: response };
      setMessages(prev => [...prev, botMessage]);
      speak(response);
      setIsProcessing(false);
    }, 500);
    
    setInputText('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleMessage(inputText);
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1E90FF, #2ECC71)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(30, 144, 255, 0.3)',
          zIndex: 1000,
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
      >
        <FaRobot size={24} />
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '350px',
            height: '500px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1E90FF, #2ECC71)',
              color: 'white',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaRobot size={20} />
              <span style={{ fontWeight: 600 }}>Travel Assistant</span>
            </div>
            <FaTimes
              onClick={() => setIsOpen(false)}
              style={{ cursor: 'pointer', fontSize: '18px' }}
            />
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                }}
              >
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '18px',
                    background: message.type === 'user' 
                      ? 'linear-gradient(135deg, #1E90FF, #2ECC71)'
                      : '#f1f3f4',
                    color: message.type === 'user' ? 'white' : '#333',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {message.text}
                  {message.type === 'bot' && (
                    <FaVolumeUp
                      onClick={() => speak(message.text)}
                      style={{
                        marginLeft: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        opacity: 0.7,
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div style={{ alignSelf: 'flex-start' }}>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '18px',
                    background: '#f1f3f4',
                    color: '#666',
                    fontSize: '14px',
                  }}
                >
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: '16px',
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about destinations, budgets, tips..."
              style={{
                flex: 1,
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '20px',
                outline: 'none',
                fontSize: '14px',
              }}
            />
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: 'none',
                background: isListening ? '#ff4757' : '#1E90FF',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isListening ? <FaMicrophoneSlash size={16} /> : <FaMicrophone size={16} />}
            </button>
            <button
              type="submit"
              disabled={!inputText.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: 'none',
                background: inputText.trim() ? '#2ECC71' : '#ccc',
                color: 'white',
                cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FaPaperPlane size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;