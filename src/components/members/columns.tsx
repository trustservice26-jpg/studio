"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { Member } from "@/lib/types"
import { useAppContext } from "@/context/app-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog"

const MemberActions: React.FC<{ member: Member }> = ({ member }) => {
  const { userRole, deleteMember, toggleMemberStatus, language } = useAppContext();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">{language === 'bn' ? 'মেনু খুলুন' : 'Open menu'}</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{language === 'bn' ? 'ক্রিয়া' : 'Actions'}</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(member.email)}>
            {language === 'bn' ? 'ইമെ일 কপি করুন' : 'Copy email'}
          </DropdownMenuItem>
          {userRole === 'admin' && (
            <>
              <DropdownMenuItem onClick={() => toggleMemberStatus(member.id)}>
                {member.status === 'active' ? (language === 'bn' ? 'নিষ্ক্রিয় হিসাবে সেট করুন' : 'Set as Inactive') : (language === 'bn' ? 'সক্রিয় হিসাবে সেট করুন' : 'Set as Active')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
               <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-destructive focus:text-destructive"
                  >
                    {language === 'bn' ? 'সদস্য মুছে ফেলুন' : 'Delete Member'}
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Are you sure?'}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {language === 'bn' ? `এই ক্রিয়াটি পূর্বাবস্থায় ফেরানো যাবে না। এটি স্থায়ীভাবে ${member.name} এর রেকর্ড মুছে ফেলবে।` : `This action cannot be undone. This will permanently delete ${member.name}'s record.`}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{language === 'bn' ? 'বাতিল করুন' : 'Cancel'}</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteMember(member.id)}>
                      {language === 'bn' ? 'চালিয়ে যান' : 'Continue'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}


export const columns: ColumnDef<Member>[] = [
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
        <div className="flex items-center gap-3">
          <Image
            src={member.avatar}
            alt={member.name}
            width={40}
            height={40}
            className="rounded-full"
            data-ai-hint="person portrait"
          />
          <div className="flex flex-col">
             <div className="font-medium">{member.name}</div>
             <div className="text-sm text-muted-foreground">{member.email}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: () => {
        const { language } = useAppContext();
        return <div>{language === 'bn' ? 'অবস্থা' : 'Status'}</div>
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const { language } = useAppContext();
      const translatedStatus = status === 'active' ? (language === 'bn' ? 'সক্রিয়' : 'active') : (language === 'bn' ? 'নিষ্ক্রিয়' : 'inactive');
      return (
        <Badge variant={status === 'active' ? "default" : "secondary"} className={status === "active" ? "bg-green-500/20 text-green-700 border-green-500/20" : ""}>
          {translatedStatus}
        </Badge>
      )
    },
  },
  {
    accessorKey: "phone",
    header: () => {
        const { language } = useAppContext();
        return <div>{language === 'bn' ? 'ফোন' : 'Phone'}</div>
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
  {
    id: "actions",
    cell: ({ row }) => <MemberActions member={row.original} />,
  },
]
