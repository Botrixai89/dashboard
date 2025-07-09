
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Copy } from "lucide-react";
import ChatWidget from "@/components/ChatWidget";
import { useToast } from "@/hooks/use-toast";

const BotPreview = () => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bot, setBot] = useState<any>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // First get the current user
    const userData = localStorage.getItem('webbot_user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Load bots using user-specific key
    const userBotsKey = `webbot_bots_${parsedUser.email || parsedUser.id}`;
    const savedBots = localStorage.getItem(userBotsKey);
    
    console.log('Loading bot with ID:', botId);
    console.log('User bots key:', userBotsKey);
    console.log('Saved bots:', savedBots);
    
    if (savedBots) {
      try {
        const bots = JSON.parse(savedBots);
        console.log('Parsed bots:', bots);
        const foundBot = bots.find((b: any) => b.id === botId);
        console.log('Found bot:', foundBot);
        setBot(foundBot);
      } catch (error) {
        console.error('Error parsing saved bots:', error);
      }
    }
  }, [botId, navigate]);

  const handleShareBot = () => {
    const embedCode = `<!-- WebBot Widget -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${window.location.origin}/widget.js';
    script.setAttribute('data-bot-id', '${bot.id}');
    script.setAttribute('data-bot-config', '${JSON.stringify(bot)}');
    document.head.appendChild(script);
  })();
</script>`;
    
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Embed code copied!",
      description: "Share this code with your clients to deploy the chatbot",
    });
  };

  const copyWidgetUrl = () => {
    const widgetUrl = `${window.location.origin}/widget/${bot.id}`;
    navigator.clipboard.writeText(widgetUrl);
    toast({
      title: "Widget URL copied!",
      description: "Use this URL to embed the widget directly",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in</h2>
          <Button onClick={() => navigate('/login')} className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Bot not found</h2>
          <p className="text-slate-400 mb-4">The bot you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-black">
      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur-sm shadow-2xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-slate-300 hover:text-white hover:bg-slate-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">{bot.name}</h1>
                <p className="text-sm text-slate-400">Preview Mode</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={copyWidgetUrl} className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                <Copy className="h-4 w-4 mr-2" />
                Copy Widget URL
              </Button>
              <Button onClick={handleShareBot} className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white">
                <Share2 className="h-4 w-4 mr-2" />
                Get Embed Code
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Website */}
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border border-slate-700">
            <h2 className="text-3xl font-bold text-white mb-4">Demo Website</h2>
            <p className="text-lg text-slate-300 mb-6 leading-relaxed">
              This is a preview of how your chatbot will appear on your client's website. 
              The chat widget is positioned in the bottom-right corner.
            </p>
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-xl font-semibold mb-3 text-white">Sample Content</h3>
              <p className="text-slate-300 mb-4 leading-relaxed">
                Welcome to our company! We provide excellent customer service and support. 
                Our team is always ready to help you with any questions or concerns.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Feel free to test the chatbot by clicking on the chat bubble in the bottom-right corner.
                You can ask questions and see how the bot responds using your configured n8n webhook.
              </p>
            </div>
          </div>

          {/* Integration Instructions */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-6">Integration Instructions</h3>
            <div className="space-y-6">
              <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700">
                <h4 className="font-semibold text-white mb-3 flex items-center">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
                  Copy the embed code
                </h4>
                <p className="text-slate-300">Click the "Get Embed Code" button above to copy the integration code.</p>
              </div>
              <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700">
                <h4 className="font-semibold text-white mb-3 flex items-center">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
                  Add to your website
                </h4>
                <p className="text-slate-300">Paste the code before the closing &lt;/body&gt; tag in your HTML.</p>
              </div>
              <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700">
                <h4 className="font-semibold text-white mb-3 flex items-center">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</span>
                  Test the integration
                </h4>
                <p className="text-slate-300">The chatbot will appear automatically and connect to your n8n webhook.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Chat Widget */}
      <ChatWidget
        botConfig={bot}
        isMinimized={isMinimized}
        onToggle={() => setIsMinimized(!isMinimized)}
      />
    </div>
  );
};

export default BotPreview;
