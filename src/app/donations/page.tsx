'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/donations/columns';
import { useAppContext } from '@/context/app-context';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

export default function DonationsPage() {
  const { donations } = useAppContext();
  const [filter, setFilter] = React.useState('');

  const filteredDonations = React.useMemo(() => {
    return donations.filter(donation =>
      donation.memberName.toLowerCase().includes(filter.toLowerCase())
    );
  }, [donations, filter]);

  const totalDonations = React.useMemo(() => {
    return donations.reduce((acc, donation) => acc + donation.amount, 0);
  }, [donations]);

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
            A list of all donations received.
          </p>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Total Donations</CardTitle>
          <CardDescription>The total amount of funds raised to date.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">৳{totalDonations.toLocaleString('en-IN')}</p>
        </CardContent>
      </Card>

      <DataTable columns={columns} data={filteredDonations}>
         <Input
          placeholder="Filter by member name..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm"
        />
      </DataTable>
    </motion.div>
  );
}
