
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, MessageSquare, Calendar, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface UserSession {
  id: string;
  session_id: string;
  user_agent: string;
  created_at: string;
  last_activity: string;
}

interface ChatMessage {
  id: string;
  session_id: string;
  message_text: string;
  sender: string;
  created_at: string;
}

const UserHistory = () => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<UserSession | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [totalMessages, setTotalMessages] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserSessions();
    fetchTotalMessages();
  }, []);

  const fetchUserSessions = async () => {
    try {
      console.log('Fetching user sessions...');
      const { data, error } = await supabase
        .from('user_session')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sessions:', error);
        toast({
          title: "Error",
          description: "Failed to load user sessions: " + error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Fetched sessions:', data);
      setSessions(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load user sessions",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const fetchTotalMessages = async () => {
    try {
      console.log('Fetching total messages...');
      const { count, error } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error fetching total messages:', error);
      } else {
        console.log('Total messages count:', count);
        setTotalMessages(count || 0);
      }
    } catch (error) {
      console.error('Error fetching total messages:', error);
    }
  };

  const fetchChatHistory = async (sessionId: string) => {
    try {
      console.log('Fetching chat history for session:', sessionId);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching chat history:', error);
        toast({
          title: "Error",
          description: "Failed to load chat history: " + error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Fetched chat messages:', data);
      setChatMessages(data || []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      });
    }
  };

  const handleViewChat = (session: UserSession) => {
    setSelectedSession(session);
    fetchChatHistory(session.session_id);
    setShowChatDialog(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading user history...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">User History & Analytics</CardTitle>
              <CardDescription>Track visitor sessions and chat interactions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-2xl font-bold">{sessions.length}</p>
                    <p className="text-sm text-gray-600">Total Visitors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{totalMessages}</p>
                    <p className="text-sm text-gray-600">Total Messages</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">Today</p>
                    <p className="text-sm text-gray-600">Active Period</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {sessions.length > 0 ? (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session ID</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>User Agent</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-mono text-xs">{session.session_id.substring(0, 20)}...</TableCell>
                      <TableCell>{formatDate(session.created_at)}</TableCell>
                      <TableCell>{formatDate(session.last_activity)}</TableCell>
                      <TableCell className="max-w-xs truncate">{session.user_agent}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewChat(session)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Chat
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No user sessions found. Sessions will appear here when users interact with your chatbots.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat History Dialog */}
      <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Chat History - Session {selectedSession?.session_id.substring(0, 20)}...
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedSession && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Session ID:</strong> {selectedSession.session_id}</div>
                  <div><strong>Created:</strong> {formatDate(selectedSession.created_at)}</div>
                  <div><strong>Total Messages:</strong> {chatMessages.length}</div>
                </div>
              </div>
            )}
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {chatMessages.length > 0 ? (
                chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-100 ml-8'
                        : 'bg-gray-100 mr-8'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-sm">
                        {message.sender === 'user' ? 'User' : 'Bot'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                    <p className="text-sm">{message.message_text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No chat messages found for this session
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserHistory;
