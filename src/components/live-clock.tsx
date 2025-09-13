'use client';

import { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { useAppContext } from '@/context/app-context';

export function LiveClock() {
  const { language } = useAppContext();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      
      const timeOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };

      const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Dhaka',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      
      const locale = language === 'bn' ? 'bn-BD' : 'en-US';

      setCurrentTime(now.toLocaleTimeString(locale, timeOptions));
      setCurrentDate(now.toLocaleDateString(locale, dateOptions));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [language]);

  return (
    <div className="px-5 py-3 text-sm text-muted-foreground space-y-2 border-t border-b border-dashed mt-2">
       <div className="flex items-center gap-2">
         <Calendar className="h-4 w-4" />
         <span>{currentDate}</span>
       </div>
       <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span>{currentTime}</span>
       </div>
    </div>
  );
}
