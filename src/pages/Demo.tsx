
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ChatWidget from "@/components/ChatWidget";

const Demo = () => {
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(true);

  const demoBotConfig = {
    id: 'demo',
    name: 'Demo Bot',
    welcomeMessage: 'Hi there! 👋 Welcome to our demo chatbot. How can I help you today?',
    webhookUrl: 'https://rahulcode9.app.n8n.cloud/webhook/daf9f0f2-fd77-439c-ad26-7517e85009de/chat',
    primaryColor: '#00a651',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjtLD7CLcLJUHFMAb72WpsutedfVAwfUupig&s',
    headerTitle: 'Customer Support',
    headerSubtitle: "I'm here to help you 24/7. Let's get started!"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Demo Content */}
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Interactive Demo
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Experience our chatbot platform in action. Click the chat bubble to start a conversation!
            </p>
          </div>

          {/* Demo Website Mockup */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <div className="border-b pb-4 mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Sample Business Website</h2>
              <p className="text-gray-600">This represents your client's website with the embedded chatbot</p>
            </div>
            
            <div className="space-y-6">
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">About Our Company</h3>
                <p className="text-gray-700 leading-relaxed">
                  We are a leading provider of innovative solutions designed to help businesses grow and succeed. 
                  Our team of experts is dedicated to delivering exceptional customer service and support.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Consulting</h4>
                    <p className="text-gray-600">Expert guidance for your business needs</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Support</h4>
                    <p className="text-gray-600">24/7 customer support and assistance</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h3>
                <p className="text-gray-700">
                  Have questions? Use our chatbot for instant support, or reach out to our team directly.
                  Our AI assistant can help you with product information, pricing, and general inquiries.
                </p>
              </section>
            </div>
          </div>

          {/* Features Highlight */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Demo Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  🎤
                </div>
                <h4 className="font-semibold mb-2">Speech-to-Text</h4>
                <p className="text-gray-600 text-sm">Click the microphone to use voice input</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  💬
                </div>
                <h4 className="font-semibold mb-2">Live Responses</h4>
                <p className="text-gray-600 text-sm">Connected to n8n webhook for real AI responses</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  ✨
                </div>
                <h4 className="font-semibold mb-2">Typing Animation</h4>
                <p className="text-gray-600 text-sm">Realistic typing indicators for better UX</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Chat Widget */}
      <ChatWidget
        botConfig={demoBotConfig}
        isMinimized={isMinimized}
        onToggle={() => setIsMinimized(!isMinimized)}
      />
    </div>
  );
};

export default Demo;
