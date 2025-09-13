
"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import type { Member } from "@/lib/types"
import { Button } from "../ui/button"
import { ArrowUpDown } from "lucide-react"

export const publicMemberColumns: ColumnDef<Member>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Member
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    cell: ({ row }) => {
      const member = row.original
      return (
        <div className="flex items-center gap-3">
          <Image
            src={member.avatar}
            alt={member.name}
            width={40}
            height={40}
            className="rounded-full"
            data-ai-hint="person portrait"
          />
          <div className="font-medium">{member.name}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
        return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Status
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "active" ? "default" : "secondary"} className={status === "active" ? "bg-green-500/20 text-green-700 border-green-500/20" : ""}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "joinDate",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Join Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    cell: ({ row }) => {
      const date = new Date(row.getValue("joinDate"))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
]
