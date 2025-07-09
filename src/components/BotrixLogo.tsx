
import { Sparkles } from "lucide-react";

const BotrixLogo = () => (
  <a
    href="https://botrixai.com"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center hover:opacity-80 transition-opacity"
    style={{ textDecoration: 'none' }}
  >
    <img 
      src="/botrix-logo.png" 
      alt="Botrix AI Logo" 
      className="h-8 w-auto"
    />
  </a>
);

export default BotrixLogo;
