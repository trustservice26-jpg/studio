
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Send, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { bn } from 'date-fns/locale';
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
  const { notices, userRole, addNotice, deleteNotice, language } = useAppContext();
  const [newMessage, setNewMessage] = React.useState('');

  const handlePostNotice = () => {
    if (newMessage.trim()) {
      addNotice(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader>
          <CardTitle>{language === 'bn' ? 'নোটিশ বোর্ড' : 'Notice Board'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userRole === 'admin' && (
              <div className="flex items-center gap-2">
                <Textarea
                  placeholder={language === 'bn' ? 'আপনার নোটিশ এখানে টাইপ করুন...' : 'Type your notice here...'}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="focus:ring-primary"
                />
                <Button size="icon" onClick={handlePostNotice} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
            <ScrollArea className="h-48 pr-4">
              <div className="space-y-4">
                {notices.map((notice) => (
                  <div key={notice.id} className="group flex items-start justify-between p-3 rounded-md bg-muted/50">
                    <div>
                      <p className="text-sm">{notice.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notice.date), { addSuffix: true, locale: language === 'bn' ? bn : undefined })}
                      </p>
                    </div>
                    {userRole === 'admin' && (
                       <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteNotice(notice.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">{language === 'bn' ? 'নোটিশ মুছে ফেলুন' : 'Delete notice'}</span>
                      </Button>
                    )}
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
