import { useMemo, useState } from 'react';
import { mockUsers } from '@/contexts/MessagingContext';
import { Message } from '@/types/message';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { format } from 'date-fns';

interface ConversationListProps {
  userId: string;
  messages: Message[];
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
}

export function ConversationList({ userId, messages, selectedUserId, onSelectUser }: ConversationListProps) {
  const [search, setSearch] = useState('');

  const conversations = useMemo(() => {
    const conversationMap = new Map<string, { user: typeof mockUsers[0]; lastMessage: Message; unreadCount: number }>();

    messages.forEach(msg => {
      let otherUserId: string | null = null;

      if (msg.senderId === userId && msg.recipientIds.length === 1) {
        otherUserId = msg.recipientIds[0];
      } else if (msg.recipientIds.includes(userId) && msg.senderId !== userId) {
        otherUserId = msg.senderId;
      }

      if (otherUserId) {
        const existing = conversationMap.get(otherUserId);
        if (!existing || msg.timestamp > existing.lastMessage.timestamp) {
          const user = mockUsers.find(u => u.id === otherUserId);
          if (user) {
            const unreadCount = messages.filter(
              m => m.senderId === otherUserId && m.recipientIds.includes(userId) && !m.read
            ).length;
            conversationMap.set(otherUserId, { user, lastMessage: msg, unreadCount });
          }
        }
      }
    });

    return Array.from(conversationMap.values()).sort(
      (a, b) => b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime()
    );
  }, [messages, userId]);

  const filteredConversations = useMemo(() => {
    if (!search.trim()) return conversations;
    return conversations.filter(({ user }) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase()) ||
      (user.location && user.location.toLowerCase().includes(search.toLowerCase()))
    );
  }, [conversations, search]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-1">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            {search ? 'No conversations found' : 'No conversations yet'}
          </div>
        ) : (
          filteredConversations.map(({ user, lastMessage, unreadCount }) => (
          <button
            key={user.id}
            onClick={() => onSelectUser(user.id)}
            className={`w-full p-3 rounded-lg text-left transition-colors hover:bg-accent ${
              selectedUserId === user.id ? 'bg-accent' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium truncate">{user.name}</span>
                  {user.location && (
                    <Badge variant="secondary" className="text-xs">
                      {user.location}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {lastMessage.content}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-muted-foreground">
                  {format(lastMessage.timestamp, 'MMM d')}
                </span>
                {unreadCount > 0 && (
                  <Badge variant="default" className="h-5 min-w-5 px-1 flex items-center justify-center rounded-full text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </button>
        ))
      )}
      </div>
    </div>
  );
}
