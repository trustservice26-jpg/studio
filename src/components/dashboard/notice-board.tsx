
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export function NoticeBoard() {
  const { notices, userRole, addNotice } = useAppContext();
  const [newMessage, setNewMessage] = React.useState('');

  const handlePostNotice = () => {
    if (newMessage.trim()) {
      addNotice(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="bg-foreground text-background">
        <CardHeader>
          <CardTitle className="text-background">Notice Board</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userRole === 'admin' && (
              <div className="flex items-center gap-2">
                <Textarea
                  placeholder="Type your notice here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="bg-background/10 text-background placeholder:text-background/60 border-background/20 focus:ring-primary"
                />
                <Button size="icon" onClick={handlePostNotice} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
            <ScrollArea className="h-48 pr-4">
              <div className="space-y-4">
                {notices.map((notice) => (
                  <div key={notice.id} className="p-3 rounded-md bg-background/10">
                    <p className="text-sm">{notice.message}</p>
                    <p className="text-xs text-background/60 mt-1">
                      {formatDistanceToNow(new Date(notice.date), { addSuffix: true })}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
