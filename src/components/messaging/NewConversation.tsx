import { useState, useMemo } from 'react';
import { mockUsers } from '@/contexts/MessagingContext';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search } from 'lucide-react';

interface NewConversationProps {
  userId: string;
  onSelectUser: (userId: string) => void;
}

export function NewConversation({ userId, onSelectUser }: NewConversationProps) {
  const [search, setSearch] = useState('');

  const availableUsers = mockUsers.filter(u => u.id !== userId);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return availableUsers;
    return availableUsers.filter(u => 
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()) ||
      (u.location && u.location.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, role, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-1">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No users found
          </div>
        ) : (
          filteredUsers.map(user => (
            <button
              key={user.id}
              onClick={() => onSelectUser(user.id)}
              className="w-full p-3 rounded-lg text-left transition-colors hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{user.name}</span>
                    {user.location && (
                      <Badge variant="secondary" className="text-xs">
                        {user.location}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
