import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Bot, X, Minimize2, Maximize2, Send, Mic, MicOff, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import BotrixLogo from "@/components/BotrixLogo";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatWidgetProps {
  botConfig: {
    id: string;
    name: string;
    welcomeMessage: string;
    webhookUrl: string;
    primaryColor: string;
    secondaryColor?: string;
    textColor?: string;
    backgroundColor?: string;
    headerTextColor?: string;
    logo?: string;
    headerTitle?: string;
    headerSubtitle?: string;
    messageBackgroundColor?: string;
    userMessageColor?: string;
    botMessageColor?: string;
    borderRadius?: string;
    fontSize?: string;
    fontFamily?: string;
  };
  isMinimized?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

const ChatWidget = ({ botConfig, isMinimized = true, onToggle, onClose }: ChatWidgetProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const sessionIdRef = useRef<string>('');
  const { toast } = useToast();

  useEffect(() => {
    // Initialize session ID and create session in database
    sessionIdRef.current = 'widget_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    
    // Create session in Supabase
    createUserSession();
    
    // Add welcome message
    if (botConfig.welcomeMessage && messages.length === 0) {
      setMessages([{
        id: '1',
        text: botConfig.welcomeMessage,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [botConfig.welcomeMessage, messages.length]);

  const createUserSession = async () => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .insert({
          session_id: sessionIdRef.current,
          user_agent: navigator.userAgent,
          bot_id: botConfig.id,
          is_active: true
        });

      if (error) {
        console.error('Error creating user session:', error);
      }
    } catch (error) {
      console.error('Error creating user session:', error);
    }
  };

  const updateSessionActivity = async () => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ 
          last_activity: new Date().toISOString(),
          is_active: true 
        })
        .eq('session_id', sessionIdRef.current);

      if (error) {
        console.error('Error updating session activity:', error);
      }
    } catch (error) {
      console.error('Error updating session activity:', error);
    }
  };

  useEffect(() => {
    // Initialize speech recognition with better error handling
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started successfully');
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        console.log('Speech recognition result received:', event);
        const transcript = event.results[0][0].transcript;
        console.log('Transcript:', transcript);
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        let errorMessage = "Speech recognition failed. ";
        switch(event.error) {
          case 'no-speech':
            errorMessage += "No speech was detected. Please try again.";
            break;
          case 'audio-capture':
            errorMessage += "Microphone access denied or not available.";
            break;
          case 'not-allowed':
            errorMessage += "Microphone permission denied. Please allow microphone access.";
            break;
          default:
            errorMessage += "Please try again or type your message.";
        }
        
        toast({
          title: "Speech recognition error",
          description: errorMessage,
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };
    }
  }, [toast]);

  // Enhanced format bot response with better styling
  const formatBotResponse = (text: string): JSX.Element => {
    // Clean up the text first
    let cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/\s+/g, ' ')
      .trim();

    const lines = cleanText.split('\n').filter(line => line.trim());
    const elements: JSX.Element[] = [];

    let currentCategory = '';
    let inList = false;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Check if it's a category header
      if (trimmedLine.includes(':') && 
          (trimmedLine.includes('Batteries') || trimmedLine.includes('UPS') || 
           trimmedLine.includes('Systems') || trimmedLine.includes('Power') ||
           trimmedLine.toLowerCase().includes('category') || trimmedLine.toLowerCase().includes('overview'))) {
        
        if (inList) {
          inList = false;
        }
        
        currentCategory = trimmedLine.replace(':', '');
        elements.push(
          <div key={`category-${index}`} className="mb-4">
            <h3 className="font-bold text-lg mb-2 text-gray-900">
              {currentCategory}
            </h3>
          </div>
        );
        inList = true;
        return;
      }

      // Check if it's a product line
      if (trimmedLine.startsWith('•') || trimmedLine.includes('Price:') || trimmedLine.includes('₹')) {
        const productLine = trimmedLine.replace(/^•\s*/, '');
        
        // Extract product name, description, URL, and price
        const parts = productLine.split(' - ');
        let productName = '';
        let description = '';
        let url = '';
        let price = '';

        if (parts.length > 0) {
          productName = parts[0].split(':')[0].trim();
          
          const restOfLine = productLine.substring(productName.length + 1);
          
          // Extract URL
          const urlMatch = restOfLine.match(/\((https?:\/\/[^\)]+)\)/);
          if (urlMatch) {
            url = urlMatch[1];
          }
          
          // Extract price
          const priceMatch = restOfLine.match(/₹[\d,]+/);
          if (priceMatch) {
            price = priceMatch[0];
          }
          
          // Extract description
          description = restOfLine
            .replace(/View Product.*?\)/g, '')
            .replace(/\|.*?Price:.*₹[\d,]+/g, '')
            .replace(/- View Product.*$/g, '')
            .replace(/₹[\d,]+/g, '')
            .trim()
            .replace(/^:/, '')
            .trim();
        }

        elements.push(
          <div key={`product-${index}`} className="mb-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
            <div className="flex flex-col space-y-2">
              <h4 className="font-semibold text-md text-gray-900">{productName}</h4>
              {description && (
                <p className="text-sm text-gray-600">{description}</p>
              )}
              <div className="flex items-center justify-between flex-wrap gap-2">
                {price && (
                  <span className="font-semibold text-green-600 text-base">
                    {price}
                  </span>
                )}
                {url && (
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    View Product
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        );
        return;
      }

      // Handle regular text lines
      if (trimmedLine) {
        // Check for URLs in regular text
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        if (urlRegex.test(trimmedLine)) {
          const parts = trimmedLine.split(urlRegex);
          const textElements = parts.map((part, partIndex) => {
            if (part.match(/^https?:\/\//)) {
              return (
                <a 
                  key={`link-${index}-${partIndex}`}
                  href={part} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline"
                >
                  {part}
                  <ExternalLink className="h-3 w-3" />
                </a>
              );
            }
            return <span key={`text-${index}-${partIndex}`}>{part}</span>;
          });
          
          elements.push(
            <p key={`line-${index}`} className="mb-2 text-gray-700">
              {textElements}
            </p>
          );
        } else {
          elements.push(
            <p key={`line-${index}`} className="mb-2 text-gray-700">
              {trimmedLine}
            </p>
          );
        }
      }
    });

    return <div className="space-y-1">{elements}</div>;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    const currentMessage = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setIsTyping(true);

    // Track user activity in Supabase
    await trackUserMessage(sessionIdRef.current, currentMessage);

    try {
      console.log('Sending message to webhook:', botConfig.webhookUrl);
      
      const payload = {
        action: 'sendMessage',
        sessionId: sessionIdRef.current,
        chatInput: currentMessage,
        message: currentMessage,
        timestamp: new Date().toISOString()
      };

      console.log('Payload:', payload);

      const response = await fetch(botConfig.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);

      let botResponse = "I received your message! How can I help you?";

      if (response.ok) {
        const responseText = await response.text();
        console.log('Raw response text:', responseText);

        if (responseText && responseText.trim()) {
          try {
            const data = JSON.parse(responseText);
            console.log('Parsed response data:', data);
            
            const possibleResponse = data.output || data.message || data.response || data.text || data.reply || data.answer || data.result;
            if (possibleResponse) {
              botResponse = possibleResponse;
            }
          } catch (parseError) {
            console.log('JSON parse failed, treating as plain text:', responseText);
            if (responseText.length > 0 && responseText.length < 2000) {
              botResponse = responseText;
            }
          }
        } else {
          console.log('Empty response body received');
          botResponse = "I'm here to help! Could you please rephrase your question?";
        }
      } else {
        console.error('Response not OK:', response.status, response.statusText);
        botResponse = "I'm having trouble processing your request right now. Please try again.";
      }

      setTimeout(async () => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          sender: 'bot',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
        setIsTyping(false);
        
        // Track bot response in Supabase
        await trackBotMessage(sessionIdRef.current, botResponse);
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      
      setTimeout(() => {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm having connection issues. Please check that your webhook is active and try again.",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
        setIsTyping(false);
      }, 1000);
    }
  };

  const trackUserMessage = async (sessionId: string, message: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          message_text: message,
          sender: 'user'
        });

      if (error) {
        console.error('Error tracking user message:', error);
      }

      // Update session activity
      await updateSessionActivity();
    } catch (error) {
      console.error('Error tracking user message:', error);
    }
  };

  const trackBotMessage = async (sessionId: string, message: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          message_text: message,
          sender: 'bot'
        });

      if (error) {
        console.error('Error tracking bot message:', error);
      }
    } catch (error) {
      console.error('Error tracking bot message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser doesn't support speech recognition",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
        console.log('Stopping speech recognition...');
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
        setIsListening(false);
      }
    } else {
      try {
        console.log('Starting speech recognition...');
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast({
          title: "Speech recognition failed",
          description: "Please ensure microphone permissions are granted and try again",
          variant: "destructive",
        });
      }
    }
  };

  // Custom styles based on bot configuration
  const customStyles = {
    '--widget-primary': botConfig.primaryColor || '#00a651',
    '--widget-background': botConfig.backgroundColor || '#ffffff',
    '--widget-text': botConfig.textColor || '#333333',
    '--widget-header-text': botConfig.headerTextColor || '#ffffff',
    '--widget-user-message': botConfig.userMessageColor || '#667eea',
    '--widget-bot-message': botConfig.botMessageColor || '#e9ecef',
    '--widget-border-radius': `${botConfig.borderRadius || '16'}px`,
    '--widget-font-size': `${botConfig.fontSize || '14'}px`,
    '--widget-font-family': botConfig.fontFamily || 'Inter, sans-serif'
  } as React.CSSProperties;



  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50" style={customStyles}>
        <Button
          onClick={onToggle}
          className="rounded-full w-16 h-16 shadow-lg hover:scale-105 transition-transform text-white"
          style={{ backgroundColor: botConfig.primaryColor }}
        >
          <Bot className="h-8 w-8" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] z-50" style={customStyles}>
      <Card className="h-full flex flex-col shadow-2xl border-0 overflow-hidden" style={{ backgroundColor: botConfig.backgroundColor, fontFamily: `var(--widget-font-family)`, fontSize: `var(--widget-font-size)` }}>
        {/* Header */}
        <div 
          className="p-4 flex items-center justify-between"
          style={{ backgroundColor: botConfig.primaryColor, color: botConfig.headerTextColor }}
        >
          <div className="flex items-center space-x-3">
            {botConfig.logo ? (
              <img src={botConfig.logo} alt="Bot" className="w-8 h-8 rounded-full" />
            ) : (
              <Bot className="h-8 w-8" />
            )}
            <div>
              <h3 className="font-semibold">
                {botConfig.headerTitle || botConfig.name}
              </h3>
              {botConfig.headerSubtitle && (
                <p className="text-sm opacity-90">{botConfig.headerSubtitle}</p>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="ghost" onClick={onToggle} className="text-white hover:bg-white/20">
              <Minimize2 className="h-4 w-4" />
            </Button>
            {onClose && (
              <Button size="sm" variant="ghost" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: botConfig.secondaryColor || '#fafafa' }}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 ${message.sender === 'user' ? '' : 'max-w-sm'}`}
                style={{
                  backgroundColor: message.sender === 'user' 
                    ? botConfig.userMessageColor || '#667eea'
                    : botConfig.botMessageColor || '#e9ecef',
                  color: message.sender === 'user' ? '#ffffff' : '#333333',
                  borderRadius: `var(--widget-border-radius)`
                }}
              >
                {message.sender === 'bot' ? formatBotResponse(message.text) : message.text}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div 
                className="max-w-xs px-4 py-2"
                style={{
                  backgroundColor: botConfig.botMessageColor || '#e9ecef',
                  color: botConfig.textColor || '#333333',
                  borderRadius: `var(--widget-border-radius)`
                }}
              >
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: botConfig.primaryColor }}></div>
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: botConfig.primaryColor, animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: botConfig.primaryColor, animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t" style={{ backgroundColor: botConfig.backgroundColor, borderColor: botConfig.secondaryColor }}>
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
              style={{ 
                backgroundColor: botConfig.secondaryColor || '#f8f9fa',
                color: botConfig.textColor,
                borderRadius: `var(--widget-border-radius)`
              }}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={toggleSpeechRecognition}
              className={isListening ? 'text-red-600 bg-red-50' : ''}
              disabled={isLoading}
              style={{ borderRadius: `var(--widget-border-radius)` }}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="text-white hover:opacity-90"
              style={{ 
                backgroundColor: botConfig.primaryColor,
                borderRadius: `var(--widget-border-radius)`
              }}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Powered by Botrix AI Footer */}
        <div className="px-4 pb-2">
          <div className="text-center">
            <a 
              href="/"
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by <BotrixLogo />
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatWidget;
