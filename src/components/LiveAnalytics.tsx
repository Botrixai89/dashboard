import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageCircle, Activity, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

const LiveAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    activeConversations: 0,
    totalConversations: 0,
    uniqueUsers: 0,
    totalMessages: 0,
    todayMessages: 0
  });

  const updateAnalytics = async () => {
    try {
      console.log('Updating analytics...');
      
      // Get total sessions - using user_session (singular) as shown in your database
      const { count: totalSessions, error: sessionsError } = await supabase
        .from('user_session')
        .select('*', { count: 'exact', head: true });

      if (sessionsError) {
        console.error('Error fetching total sessions:', sessionsError);
      }

      // Get active sessions (last 30 minutes)
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      const { count: activeSessions, error: activeError } = await supabase
        .from('user_session')
        .select('*', { count: 'exact', head: true })
        .gte('last_activity', thirtyMinutesAgo);

      if (activeError) {
        console.error('Error fetching active sessions:', activeError);
      }

      // Get total messages
      const { count: totalMessages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('sender', 'user');

      if (messagesError) {
        console.error('Error fetching total messages:', messagesError);
      }

      // Get today's messages
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayMessages, error: todayError } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('sender', 'user')
        .gte('created_at', today.toISOString());

      if (todayError) {
        console.error('Error fetching today messages:', todayError);
      }

      console.log('Analytics data:', { totalSessions, activeSessions, totalMessages, todayMessages });

      setAnalytics({
        activeConversations: activeSessions || 0,
        totalConversations: totalSessions || 0,
        uniqueUsers: totalSessions || 0,
        totalMessages: totalMessages || 0,
        todayMessages: todayMessages || 0
      });
    } catch (error) {
      console.error('Error updating analytics:', error);
    }
  };

  useEffect(() => {
    // Update analytics immediately
    updateAnalytics();
    
    // Set up interval to update every 10 seconds for live tracking
    const interval = setInterval(updateAnalytics, 10000);
    
    // Set up real-time subscriptions
    const sessionChannel = supabase
      .channel('user_session_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'user_session' 
      }, (payload) => {
        console.log('Session change detected:', payload);
        updateAnalytics();
      })
      .subscribe();

    const messagesChannel = supabase
      .channel('chat_messages_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'chat_messages' 
      }, (payload) => {
        console.log('Message change detected:', payload);
        updateAnalytics();
      })
      .subscribe();
    
    return () => {
      clearInterval(interval);
      supabase.removeChannel(sessionChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, []);

  const analyticsCards = [
    {
      title: "Active Conversations",
      value: analytics.activeConversations,
      icon: Activity,
      gradient: "from-emerald-600 to-emerald-400",
      description: "Live conversations"
    },
    {
      title: "Total Conversations",
      value: analytics.totalConversations,
      icon: MessageCircle,
      gradient: "from-blue-600 to-blue-400",
      description: "All time sessions"
    },
    {
      title: "Unique Users",
      value: analytics.uniqueUsers,
      icon: Users,
      gradient: "from-purple-600 to-purple-400",
      description: "Total unique visitors"
    },
    {
      title: "Messages Today",
      value: analytics.todayMessages,
      icon: TrendingUp,
      gradient: "from-orange-600 to-orange-400",
      description: "Today's activity"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {analyticsCards.map((card) => {
        const IconComponent = card.icon;
        return (
          <Card 
            key={card.title} 
            className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:from-slate-700 hover:to-slate-800 transition-all duration-300 hover:shadow-2xl group"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-300">
                  {card.title}
                </CardTitle>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${card.gradient} shadow-lg`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-white">
                  {card.value.toLocaleString()}
                </div>
                <p className="text-sm text-slate-400">{card.description}</p>
                {card.title === "Active Conversations" && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-emerald-400 font-medium">Live</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default LiveAnalytics;
