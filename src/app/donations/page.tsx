'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/app-context';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/donations/columns';
import { Input } from '@/components/ui/input';

export default function DonationsPage() {
  const { donations } = useAppContext();
  const [filter, setFilter] = React.useState('');
  
  const filteredDonations = React.useMemo(() => {
    return donations.filter(donation =>
      donation.memberName.toLowerCase().includes(filter.toLowerCase())
    );
  }, [donations, filter]);


  return (
    <motion.div
      className="container mx-auto py-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Donations</h1>
          <p className="text-muted-foreground">
            A record of all financial contributions.
          </p>
        </div>
      </div>
      
      <DataTable columns={columns} data={filteredDonations}>
        <Input
            placeholder="Filter by member..."
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="max-w-sm"
          />
      </DataTable>
    </motion.div>
  );
}
