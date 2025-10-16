
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Member } from "@/lib/types"
import { useAppContext } from "@/context/app-context"

export const smartCardMemberColumns = (onViewCard: (member: Member) => void): ColumnDef<Member>[] => [
  {
    accessorKey: "memberId",
    header: ({ column }) => {
      const { language } = useAppContext();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {language === 'bn' ? 'সদস্য আইডি' : 'Member ID'}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const memberId = row.original.memberId;
        return <div className="font-mono">{memberId}</div>
    }
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      const { language } = useAppContext();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {language === 'bn' ? 'সদস্য' : 'Member'}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const member = row.original
      return (
        <div className="font-medium">{member.name}</div>
      )
    },
  },
    {
    accessorKey: "phone",
    header: () => {
        const { language } = useAppContext();
        return <div className="hidden sm:table-cell">{language === 'bn' ? 'ফোন' : 'Phone'}</div>
    },
     cell: ({ row }) => {
        const phone = row.getValue("phone") as string;
        return <div className="hidden sm:table-cell">{phone}</div>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { language } = useAppContext();
      return (
        <Button onClick={() => onViewCard(row.original)} size="sm">
            <CreditCard className="mr-2 h-4 w-4" />
            {language === 'bn' ? 'কার্ড দেখুন' : 'View Card'}
        </Button>
      )
    },
  },
]
