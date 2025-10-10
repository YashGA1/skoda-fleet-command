import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMessaging } from '@/contexts/MessagingContext';
import { Message } from '@/types/message';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Radio } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

const ROLE_OPTIONS = [
  { value: 'super_admin', label: 'Super Admins' },
  { value: 'admin', label: 'Admins' },
  { value: 'trainer', label: 'Trainers' },
  { value: 'security', label: 'Security' },
];

export function BroadcastInterface() {
  const { user } = useAuth();
  const { messages, sendMessage } = useMessaging();
  const [newMessage, setNewMessage] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [broadcastToAll, setBroadcastToAll] = useState(true);

  const broadcastMessages = messages
    .filter(msg => msg.recipientIds.length === 0)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    if (broadcastToAll) {
      sendMessage(newMessage, [], []);
    } else if (selectedRoles.length > 0) {
      sendMessage(newMessage, [], selectedRoles);
    }
    
    setNewMessage('');
    setSelectedRoles([]);
    setBroadcastToAll(true);
  };

  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
    setBroadcastToAll(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Compose Section */}
      <div className="border-b p-4">
        <div className="flex items-center gap-2 mb-3">
          <Radio className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Broadcast Message</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="broadcast-all" 
              checked={broadcastToAll}
              onCheckedChange={(checked) => {
                setBroadcastToAll(checked as boolean);
                if (checked) setSelectedRoles([]);
              }}
            />
            <Label htmlFor="broadcast-all" className="text-sm font-medium">
              Broadcast to everyone
            </Label>
          </div>

          {!broadcastToAll && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Or select specific roles:</p>
              <div className="grid grid-cols-2 gap-2">
                {ROLE_OPTIONS.map(role => (
                  <div key={role.value} className="flex items-center gap-2">
                    <Checkbox 
                      id={role.value}
                      checked={selectedRoles.includes(role.value)}
                      onCheckedChange={() => handleRoleToggle(role.value)}
                    />
                    <Label htmlFor={role.value} className="text-sm">
                      {role.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Textarea
              placeholder="Type your broadcast message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={2}
              className="resize-none"
            />
            <Button onClick={handleSend} size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {broadcastMessages.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            <Radio className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No broadcast messages yet</p>
          </div>
        ) : (
          broadcastMessages.map(msg => (
            <Card key={msg.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {msg.senderName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{msg.senderName}</span>
                      <Badge variant="secondary" className="text-xs">
                        {msg.senderRole}
                      </Badge>
                      {msg.recipientRoles && msg.recipientRoles.length > 0 ? (
                        <Badge variant="outline" className="text-xs">
                          To: {msg.recipientRoles.join(', ')}
                        </Badge>
                      ) : (
                        <Badge variant="default" className="text-xs">
                          Everyone
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm whitespace-pre-wrap break-words mb-2">
                      {msg.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(msg.timestamp, 'MMM d, yyyy · h:mm a')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
