
'use client';

import * as React from 'react';
import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

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

export function HomeMemberStatus() {
  const { members, language } = useAppContext();

  const statusCounts = React.useMemo(() => {
    return members.reduce(
      (acc, member) => {
        if (member.status === 'active') {
          acc.active += 1;
        } else {
          acc.inactive += 1;
        }
        return acc;
      },
      { active: 0, inactive: 0 }
    );
  }, [members]);

  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader>
          <CardTitle>{language === 'bn' ? 'সদস্য স্ট্যাটাস ওভারভিউ' : 'Member Status Overview'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{language === 'bn' ? 'সক্রিয় সদস্য' : 'Active Members'}</span>
              <Badge variant="default" className="bg-green-500/20 text-green-700 border-green-500/20 text-lg">
                {language === 'bn' ? statusCounts.active.toLocaleString('bn-BD') : statusCounts.active}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{language === 'bn' ? 'নিষ্ক্রিয় সদস্য' : 'Inactive Members'}</span>
               <Badge variant="secondary" className="text-lg">
                {language === 'bn' ? statusCounts.inactive.toLocaleString('bn-BD') : statusCounts.inactive}
              </Badge>
            </div>
             <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{language === 'bn' ? 'সর্বমোট সদস্য' : 'Total Members'}</span>
               <Badge variant="outline" className="text-lg">
                {language === 'bn' ? members.length.toLocaleString('bn-BD') : members.length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
