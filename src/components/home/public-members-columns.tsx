"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import type { Member } from "@/lib/types"
import { Button } from "../ui/button"
import { ArrowUpDown } from "lucide-react"
import { useAppContext } from "@/context/app-context"

export const publicMemberColumns: ColumnDef<Member>[] = [
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
    accessorKey: "status",
    header: ({ column }) => {
        const { language } = useAppContext();
        return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              {language === 'bn' ? 'অবস্থা' : 'Status'}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const { language } = useAppContext();
      const translatedStatus = status === 'active' ? (language === 'bn' ? 'সক্রিয়' : 'active') : (language === 'bn' ? 'নিষ্ক্রিয়' : 'inactive');
      return (
        <Badge variant={status === "active" ? "default" : "secondary"} className={status === "active" ? "bg-green-500/20 text-green-700 border-green-500/20" : ""}>
          {translatedStatus}
        </Badge>
      )
    },
  },
  {
    accessorKey: "joinDate",
    header: ({ column }) => {
        const { language } = useAppContext();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {language === 'bn' ? 'যোগদানের তারিখ' : 'Join Date'}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    cell: ({ row }) => {
      const date = new Date(row.getValue("joinDate"))
      const { language } = useAppContext();
      return <div>{date.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')}</div>
    },
  },
]
