import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMessaging, mockUsers } from '@/contexts/MessagingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Users, User } from 'lucide-react';
import { format } from 'date-fns';

export function Messages() {
  const { user } = useAuth();
  const { messages, sendMessage, markAsRead } = useMessaging();
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<'broadcast' | 'direct'>('broadcast');
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [broadcastTo, setBroadcastTo] = useState<string>('all');

  const handleSend = () => {
    if (!newMessage.trim()) return;

    if (messageType === 'broadcast') {
      if (broadcastTo === 'all') {
        sendMessage(newMessage, []);
      } else {
        sendMessage(newMessage, [], [broadcastTo]);
      }
    } else {
      if (selectedRecipient) {
        sendMessage(newMessage, [selectedRecipient]);
      }
    }

    setNewMessage('');
    setSelectedRecipient('');
  };

  // Filter messages relevant to current user
  const userMessages = messages.filter(msg => {
    if (msg.senderId === user?.id) return true;
    if (msg.recipientIds.length === 0) return true; // broadcast to all
    if (msg.recipientIds.includes(user?.id || '')) return true;
    if (msg.recipientRoles?.includes(user?.role || '')) return true;
    return false;
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const availableRecipients = mockUsers.filter(u => u.id !== user?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Communicate with team members across locations</p>
      </div>

      {/* Send Message */}
      <Card>
        <CardHeader>
          <CardTitle>Send Message</CardTitle>
          <CardDescription>
            Send a message to specific users or broadcast to roles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={messageType === 'broadcast' ? 'default' : 'outline'}
              onClick={() => setMessageType('broadcast')}
              className="flex-1"
            >
              <Users className="mr-2 h-4 w-4" />
              Broadcast
            </Button>
            <Button
              variant={messageType === 'direct' ? 'default' : 'outline'}
              onClick={() => setMessageType('direct')}
              className="flex-1"
            >
              <User className="mr-2 h-4 w-4" />
              Direct Message
            </Button>
          </div>

          {messageType === 'broadcast' ? (
            <Select value={broadcastTo} onValueChange={setBroadcastTo}>
              <SelectTrigger>
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="admin">All Admins</SelectItem>
                <SelectItem value="trainer">All Trainers</SelectItem>
                <SelectItem value="security">All Security</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
              <SelectTrigger>
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent>
                {availableRecipients.map(u => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={4}
          />

          <Button onClick={handleSend} className="w-full">
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </CardContent>
      </Card>

      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {userMessages.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No messages yet</p>
          ) : (
            userMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-lg border ${
                  msg.senderId === user?.id
                    ? 'bg-primary/5 border-primary/20'
                    : msg.read
                    ? 'bg-muted/20'
                    : 'bg-accent/10 border-accent'
                }`}
                onClick={() => !msg.read && msg.senderId !== user?.id && markAsRead(msg.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{msg.senderName}</p>
                    <p className="text-sm text-muted-foreground">
                      {msg.senderRole}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {format(msg.timestamp, 'MMM d, h:mm a')}
                    </p>
                    {msg.recipientIds.length === 0 ? (
                      <Badge variant="secondary" className="mt-1">
                        Broadcast
                      </Badge>
                    ) : msg.recipientRoles ? (
                      <Badge variant="outline" className="mt-1">
                        To: {msg.recipientRoles.join(', ')}
                      </Badge>
                    ) : null}
                  </div>
                </div>
                <p className="text-sm">{msg.content}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
