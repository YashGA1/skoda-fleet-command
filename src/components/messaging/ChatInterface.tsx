import { useState, useEffect, useRef } from 'react';
import { mockUsers } from '@/contexts/MessagingContext';
import { Message } from '@/types/message';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

interface ChatInterfaceProps {
  userId: string;
  selectedUserId: string;
  messages: Message[];
  sendMessage: (content: string, recipientIds: string[]) => void;
  markAsRead: (messageId: string) => void;
  onBack: () => void;
}

export function ChatInterface({ userId, selectedUserId, messages, sendMessage, markAsRead, onBack }: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedUser = mockUsers.find(u => u.id === selectedUserId);

  const conversationMessages = messages
    .filter(msg => 
      (msg.senderId === userId && msg.recipientIds.includes(selectedUserId)) ||
      (msg.senderId === selectedUserId && msg.recipientIds.includes(userId))
    )
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    conversationMessages.forEach(msg => {
      if (msg.senderId === selectedUserId && !msg.read) {
        markAsRead(msg.id);
      }
    });
  }, [conversationMessages, selectedUserId, markAsRead]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMessage(newMessage, [selectedUserId]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!selectedUser) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarFallback>{selectedUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{selectedUser.name}</h3>
            {selectedUser.location && (
              <Badge variant="secondary" className="text-xs">
                {selectedUser.location}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{selectedUser.role}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversationMessages.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          conversationMessages.map(msg => {
            const isOwn = msg.senderId === userId;
            return (
              <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-lg p-3 ${
                      isOwn
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                  <p className={`text-xs text-muted-foreground mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                    {format(msg.timestamp, 'h:mm a')}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
            className="resize-none"
          />
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
