import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMessaging } from '@/contexts/MessagingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquarePlus } from 'lucide-react';
import { ConversationList } from '@/components/messaging/ConversationList';
import { ChatInterface } from '@/components/messaging/ChatInterface';
import { NewConversation } from '@/components/messaging/NewConversation';
import { BroadcastInterface } from '@/components/messaging/BroadcastInterface';

export function Messages() {
  const { user } = useAuth();
  const { messages, sendMessage, markAsRead } = useMessaging();
  const [view, setView] = useState<'list' | 'chat' | 'new'>('list');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    setView('chat');
  };

  const handleBack = () => {
    setView('list');
    setSelectedUserId(null);
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Direct messaging with team members</p>
      </div>

      <Card className="h-[calc(100%-5rem)] overflow-hidden">
        <CardContent className="p-0 h-full">
          <div className="grid md:grid-cols-[380px_1fr] h-full">
            {/* Left Panel - Conversation List */}
            <div className={`border-r ${view === 'chat' ? 'hidden md:block' : 'block'}`}>
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-semibold">Conversations</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setView('new')}
                >
                  <MessageSquarePlus className="h-5 w-5" />
                </Button>
              </div>
              
              <Tabs defaultValue="direct" className="h-[calc(100%-4rem)]">
                <TabsList className="w-full grid grid-cols-2 rounded-none border-b">
                  <TabsTrigger value="direct">Direct</TabsTrigger>
                  <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
                </TabsList>
                
                <TabsContent value="direct" className="m-0 p-4 h-[calc(100%-2.5rem)] overflow-y-auto">
                  {view === 'new' ? (
                    <NewConversation 
                      userId={user?.id || ''} 
                      onSelectUser={handleSelectUser}
                    />
                  ) : (
                    <ConversationList
                      userId={user?.id || ''}
                      messages={messages}
                      selectedUserId={selectedUserId}
                      onSelectUser={handleSelectUser}
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="broadcast" className="m-0 h-[calc(100%-2.5rem)]">
                  <BroadcastInterface />
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Panel - Chat Interface */}
            <div className={`${view !== 'chat' ? 'hidden md:flex' : 'flex'} flex-col h-full`}>
              {selectedUserId ? (
                <ChatInterface
                  userId={user?.id || ''}
                  selectedUserId={selectedUserId}
                  messages={messages}
                  sendMessage={sendMessage}
                  markAsRead={markAsRead}
                  onBack={handleBack}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <MessageSquarePlus className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
