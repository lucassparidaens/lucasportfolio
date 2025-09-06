"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function Footer() {
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState<Array<{id: number, text: string, isUser: boolean}>>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (message?: string) => {
    const messageText = message || currentInput.trim();
    if (!messageText) return;

    const newMessage = {
      id: Date.now(),
      text: messageText,
      isUser: true
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentInput("");
    setIsActive(true);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: getAIResponse(messageText),
        isUser: false
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('frontend') || lowerInput.includes('react') || lowerInput.includes('javascript')) {
      return "Ik ben expert in frontend development! Ik werk met HTML5, CSS3, JavaScript, React en Three.js voor interactieve 3D ervaringen. Bekijk de Frontend Development keycap set voor alle details!";
    } else if (lowerInput.includes('ecommerce') || lowerInput.includes('shopify') || lowerInput.includes('magento')) {
      return "E-commerce is één van mijn specialiteiten! Ik bouw op Shopify, Magento en integreer met marketplaces zoals Bol.com, Amazon en MediaMarkt. Van dropshipping tot enterprise oplossingen.";
    } else if (lowerInput.includes('design') || lowerInput.includes('figma') || lowerInput.includes('ux')) {
      return "Design & UX/UI is mijn passie! Ik werk met Figma, Adobe Creative Suite en focus op gebruikersgericht ontwerp. Van wireframes tot pixel-perfect implementaties.";
    } else if (lowerInput.includes('mobile') || lowerInput.includes('app') || lowerInput.includes('swift')) {
      return "Mobile development doe ik met Swift voor iOS en Flutter voor cross-platform apps. Ook progressive web apps die native voelen op alle devices!";
    } else if (lowerInput.includes('marketing') || lowerInput.includes('ads') || lowerInput.includes('social')) {
      return "Digital marketing is waar data en creativiteit samenkomen! Ik run Meta Ads, Google Ads, TikTok campaigns en email automation met Klaviyo voor maximale ROI.";
    } else if (lowerInput.includes('ai') || lowerInput.includes('chatbot') || lowerInput.includes('automation')) {
      return "AI & Automation is de toekomst! Ik integreer ChatGPT, Claude, Gemini en bouw custom chatbots. Van process automation tot intelligente content generatie.";
    } else if (lowerInput.includes('logistics') || lowerInput.includes('supply') || lowerInput.includes('warehouse')) {
      return "Supply chain en logistics optimalisatie voor e-commerce! Ik automatiseer inbound/outbound processen en inventory management voor maximale efficiëntie.";
    } else if (lowerInput.includes('apple') || lowerInput.includes('sports') || lowerInput.includes('mental health')) {
      return "Buiten tech ben ik Apple product specialist, voetbal fan, train MMA/BJJ/Kickboxing en zet me in voor mental health awareness. Balans is belangrijk!";
    } else if (lowerInput.includes('skills') || lowerInput.includes('keyboard')) {
      return "Dit keyboard toont mijn 8 expertisegebieden: Frontend Dev, E-commerce, Design, Mobile, Marketing, AI, Logistics en Lifestyle. Elk met 50+ tools en technologieën!";
    } else if (lowerInput.includes('contact') || lowerInput.includes('project')) {
      return "Ik ben altijd open voor interessante projecten! Of het nu gaat om e-commerce automation, AI integratie, of mobile apps - laten we praten over jouw ideeën.";
    } else if (lowerInput.includes('portfolio') || lowerInput.includes('werk')) {
      return "Mijn portfolio toont projecten van 3D webapps tot AI chatbots, van Shopify stores tot mobile apps. Deze skills keyboard is zelf ook een portfolio piece!";
    }
    
    return "Geweldig dat je geïnteresseerd bent! Selecteer een keycap set hierboven om meer te leren over een specifiek expertisegebied, of vraag me specifiek naar frontend, e-commerce, design, mobile, marketing, AI, logistics of lifestyle skills.";
  };

  const handlePillClick = (action: string) => {
    const messages = {
      me: "Vertel me meer over jezelf",
      projects: "Wat voor projecten heb je gemaakt?",
      skills: "Welke skills heb je?",
      fun: "Wat vind je leuk aan programmeren?",
      contact: "Hoe kan ik contact met je opnemen?"
    };
    
    const message = messages[action as keyof typeof messages];
    if (message) {
      handleSendMessage(message);
    }
  };

  return (
    <footer className="relative bg-white/50 backdrop-blur-sm border-t border-slate-200/30 min-h-[400px] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {!isActive ? (
          // Initial State
          <div className="text-center space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                Stel je laatste vraag aan Lucas AI
              </h2>
            </div>
            
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img 
                src="/lucas-memoji.svg" 
                alt="Lucas Memoji" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ask me anything..." 
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-3 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5B8DEF] focus:border-transparent"
                />
                <button 
                  onClick={() => handleSendMessage()}
                  className="px-6 py-3 bg-gradient-to-r from-[#5B8DEF] to-[#9AE6B4] text-white rounded-full hover:shadow-lg transition-all duration-200"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { action: 'me', icon: '👨‍💻', label: 'Me' },
                { action: 'projects', icon: '💼', label: 'Projects' },
                { action: 'skills', icon: '⚡', label: 'Skills' },
                { action: 'fun', icon: '🎮', label: 'Fun' },
                { action: 'contact', icon: '📧', label: 'Contact' }
              ].map(pill => (
                <button
                  key={pill.action}
                  onClick={() => handlePillClick(pill.action)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-white border border-slate-200 rounded-full text-slate-600 hover:text-[#5B8DEF] transition-all duration-200 backdrop-blur-sm"
                >
                  <span>{pill.icon}</span>
                  <span className="font-medium">{pill.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Chat State
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img 
                  src="/lucas-memoji.svg" 
                  alt="Lucas Memoji" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Lucas AI</h3>
                <p className="text-sm text-slate-500">Skills Keyboard Assistant</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.isUser
                        ? 'bg-[#5B8DEF] text-white'
                        : 'bg-white text-slate-800 border border-slate-200'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-200">
                    <span className="text-slate-500">Lucas AI is aan het typen</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="Type je vraag..." 
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-2 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5B8DEF] focus:border-transparent"
              />
              <button 
                onClick={() => handleSendMessage()}
                className="px-4 py-2 bg-gradient-to-r from-[#5B8DEF] to-[#9AE6B4] text-white rounded-full hover:shadow-lg transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
                </svg>
              </button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { action: 'me', icon: '👨‍💻', label: 'Me' },
                { action: 'projects', icon: '💼', label: 'Projects' },
                { action: 'skills', icon: '⚡', label: 'Skills' },
                { action: 'contact', icon: '📧', label: 'Contact' }
              ].map(pill => (
                <button
                  key={pill.action}
                  onClick={() => handlePillClick(pill.action)}
                  className="flex items-center gap-1 px-3 py-1 bg-white/70 hover:bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:text-[#5B8DEF] transition-all duration-200"
                >
                  <span>{pill.icon}</span>
                  <span>{pill.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link href="http://localhost:8000" className="flex items-center gap-2 text-lg font-bold text-slate-800 hover:text-[#5B8DEF] transition-colors">
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <img src="/lucas-memoji.svg" alt="Lucas" className="w-full h-full object-cover" />
              </div>
              LUCAS
            </Link>
            <span className="text-slate-500">© {new Date().getFullYear()}</span>
          </div>
          
          <nav className="flex gap-6">
            <Link href="http://localhost:8000" className="text-slate-600 hover:text-[#5B8DEF] transition-colors">Home</Link>
            <Link href="http://localhost:8000#projects" className="text-slate-600 hover:text-[#5B8DEF] transition-colors">Projecten</Link>
            <Link href="#keycap-changer" className="text-slate-600 hover:text-[#5B8DEF] transition-colors">Skills</Link>
            <Link href="http://localhost:8000#contact" className="text-slate-600 hover:text-[#5B8DEF] transition-colors">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
