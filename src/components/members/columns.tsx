
"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, History, Mail, UserCog } from "lucide-react"

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
import { MemberTransactionHistoryModal } from "./member-transaction-history-modal"
import { SetPermissionsDialog } from "./set-permissions-dialog"

const MemberActions: React.FC<{ member: Member }> = ({ member }) => {
  const { userRole, deleteMember, toggleMemberStatus, language } = useAppContext();
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [isPermissionsOpen, setPermissionsOpen] = React.useState(false);


  return (
    <>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{language === 'bn' ? 'মেনু খুলুন' : 'Open menu'}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{language === 'bn' ? 'ক্রিয়া' : 'Actions'}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setIsHistoryOpen(true)}>
               <History className="mr-2 h-4 w-4" />
               {language === 'bn' ? 'লেনদেনের ইতিহাস' : 'Transaction History'}
            </DropdownMenuItem>
            {userRole === 'admin' && (
              <>
                <DropdownMenuItem onClick={() => toggleMemberStatus(member.id)}>
                  {member.status === 'active' ? (language === 'bn' ? 'নিষ্ক্রিয় হিসাবে সেট করুন' : 'Set as Inactive') : (language === 'bn' ? 'সক্রিয় হিসাবে সেট করুন' : 'Set as Active')}
                </DropdownMenuItem>
                 <DropdownMenuItem onClick={() => setPermissionsOpen(true)}>
                  <UserCog className="mr-2 h-4 w-4" />
                  {language === 'bn' ? 'অনুমতি সেট করুন' : 'Set Permissions'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault()
                      setIsAlertOpen(true)
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    {language === 'bn' ? 'সদস্য মুছে ফেলুন' : 'Delete Member'}
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
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
      <MemberTransactionHistoryModal
        member={member}
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
      />
      <SetPermissionsDialog
        member={member}
        open={isPermissionsOpen}
        onOpenChange={setPermissionsOpen}
      />
    </>
  )
}


export const columns: ColumnDef<Member>[] = [
  {
    id: 'serialNumber',
    header: () => {
      const { language } = useAppContext();
      return <span>{language === 'bn' ? 'ক্রমিক' : 'Sl.'}</span>;
    },
    cell: ({ row, table }) => {
      const pageIndex = (table.getState().pagination.pageIndex);
      const pageSize = table.getState().pagination.pageSize;
      return <span>{pageIndex * pageSize + row.index + 1}</span>;
    },
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
        <div className="flex flex-col">
           <div className="font-medium">{member.name}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: () => {
        const { language } = useAppContext();
        return <div>{language === 'bn' ? 'ভূমিকা' : 'Role'}</div>
    },
    cell: ({ row }) => {
      const { language } = useAppContext();
      const role = row.original.role;
      if (role === 'moderator') {
        return <Badge variant="secondary">{language === 'bn' ? 'মডারেটর' : 'Moderator'}</Badge>
      }
      return <span className="text-muted-foreground">{language === 'bn' ? 'সদস্য' : 'Member'}</span>
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
      const translatedStatus = status === 'active' ? (language === 'bn' ? 'সক্রিয়' : 'Active') : (language === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive');
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
    accessorKey: "email",
    header: () => {
        const { language } = useAppContext();
        return <div className="flex items-center"><Mail className="mr-2 h-4 w-4" />{language === 'bn' ? 'ইমেইল' : 'Email'}</div>
    },
    cell: ({ row }) => {
        const email = row.getValue("email") as string;
        return email ? <a href={`mailto:${email}`} className="hover:underline">{email}</a> : <span className="text-muted-foreground/50">N/A</span>
    }
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
