import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMessaging } from '@/contexts/MessagingContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Radio, Users } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Compose Section */}
      <div className="p-6 border-b bg-muted/30 shrink-0">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Radio className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Send Broadcast</h3>
              <p className="text-sm text-muted-foreground">Message multiple recipients at once</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="broadcast-all" 
                checked={broadcastToAll}
                onCheckedChange={(checked) => {
                  setBroadcastToAll(checked as boolean);
                  if (checked) setSelectedRoles([]);
                }}
              />
              <Label htmlFor="broadcast-all" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                <Users className="h-4 w-4" />
                Send to everyone
              </Label>
            </div>

            {!broadcastToAll && (
              <div className="pl-6 space-y-3">
                <p className="text-sm text-muted-foreground">Select specific roles:</p>
                <div className="grid grid-cols-2 gap-3">
                  {ROLE_OPTIONS.map(role => (
                    <div key={role.value} className="flex items-center gap-2">
                      <Checkbox 
                        id={role.value}
                        checked={selectedRoles.includes(role.value)}
                        onCheckedChange={() => handleRoleToggle(role.value)}
                      />
                      <Label htmlFor={role.value} className="text-sm cursor-pointer">
                        {role.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Textarea
                placeholder="Type your broadcast message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                rows={3}
                className="resize-none"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleSend} 
                  disabled={!newMessage.trim()}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send Broadcast
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {broadcastMessages.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Radio className="h-8 w-8 opacity-50" />
              </div>
              <p className="font-medium mb-1">No broadcasts yet</p>
              <p className="text-sm">Send your first broadcast message above</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <h4 className="text-sm font-medium text-muted-foreground">Recent Broadcasts</h4>
                <Badge variant="secondary" className="text-xs">
                  {broadcastMessages.length}
                </Badge>
              </div>
              
              {broadcastMessages.map(msg => (
                <Card key={msg.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {msg.senderName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="font-medium">{msg.senderName}</span>
                            <Badge variant="secondary" className="text-xs">
                              {msg.senderRole}
                            </Badge>
                            {msg.recipientRoles && msg.recipientRoles.length > 0 ? (
                              <Badge variant="outline" className="text-xs gap-1">
                                <Users className="h-3 w-3" />
                                {msg.recipientRoles.join(', ')}
                              </Badge>
                            ) : (
                              <Badge className="text-xs gap-1">
                                <Users className="h-3 w-3" />
                                Everyone
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-muted/50 border-t">
                      <p className="text-xs text-muted-foreground">
                        {format(msg.timestamp, 'EEEE, MMMM d, yyyy · h:mm a')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
