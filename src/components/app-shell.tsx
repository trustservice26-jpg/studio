
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Menu,
  Users,
  Home,
  ShieldCheck,
  UserPlus,
  DollarSign,
  LogIn,
  LogOut,
  UserCog,
  CreditCard,
  Megaphone,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAppContext } from '@/context/app-context';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LanguageSwitcher } from './language-switcher';
import { LiveClock } from './live-clock';
import { RegisterMemberDialog } from './home/register-member-dialog';
import { useIsClient } from '@/hooks/use-is-client';
import { ThemeSwitcher } from './theme-switcher';
import type { UserRole, Member } from '@/lib/types';

const navItems = [
    { href: '/', label: 'Home', bn_label: 'হোম', icon: Home, roles: ['admin', 'moderator', 'member-moderator', 'member'], permissions: [] },
    { href: '/notice-board', label: 'Notice Board', bn_label: 'নোটিশ বোর্ড', icon: Megaphone, roles: ['admin', 'moderator', 'member-moderator', 'member'], permissions: [] },
    { href: '/dashboard', label: 'Dashboard', bn_label: 'ড্যাশবোর্ড', icon: LayoutDashboard, roles: ['admin'], permissions: [] },
    { href: '/members', label: 'Members', bn_label: 'সদস্য', icon: Users, roles: ['admin'], permissions: ['canManageMembers'] },
    { href: '/transactions', label: 'Transactions', bn_label: 'লেনদেন', icon: CreditCard, roles: ['admin', 'moderator'], permissions: ['canManageTransactions'] },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, setUser, language, members } = useAppContext();
  const { toast } = useToast();
  const [isPasswordDialogOpen, setPasswordDialogOpen] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [isRegisterOpen, setRegisterOpen] = React.useState(false);
  const isClient = useIsClient();
  
  const userRole = user?.role || 'member';

  const handleLoginClick = () => {
    if (user) {
      setUser(null);
      toast({
        title: language === 'bn' ? 'সদস্য ভিউতে সুইচ করা হয়েছে' : 'Logged Out',
        description: language === 'bn' ? 'আপনি এখন সদস্য ভিউ মোডে আছেন।' : 'You are now in member view mode.',
      });
    } else {
      setPasswordDialogOpen(true);
    }
  };

  const handlePasswordSubmit = () => {
    let authenticatedUser: Member | null = null;
    let toastTitle = '';
    let toastDescription = '';
    let loggedIn = false;

    if (password === 'admin123') {
        authenticatedUser = {
            id: 'admin-user',
            name: 'Admin',
            role: 'admin',
            memberId: '0000',
            phone: '',
            avatar: '',
            status: 'active',
            joinDate: new Date().toISOString(),
            contributions: '',
        };
        toastTitle = language === 'bn' ? 'এডমিন ভিউতে সুইচ করা হয়েছে' : 'Logged In as Admin';
        toastDescription = language === 'bn' ? 'আপনার এখন প্রশাসনিক বিশেষ অধিকার রয়েছে।' : 'You now have administrative privileges.';
        loggedIn = true;

    } else if (password === 'mode123') {
        authenticatedUser = members.find(m => (m.permissions?.canManageTransactions || m.permissions?.canManageMembers) && m.role !== 'admin') || null;
        toastTitle = language === 'bn' ? 'মডারেটর হিসেবে লগইন করেছেন' : 'Logged In as Moderator';
        toastDescription = language === 'bn' ? 'আপনার এখন নির্ধারিত পরিচালনার অনুমতি রয়েছে।' : 'You now have designated management privileges.';
        if (authenticatedUser) loggedIn = true;
    }

    if (loggedIn && authenticatedUser) {
        setUser(authenticatedUser);
        toast({ title: toastTitle, description: toastDescription });
        setPasswordDialogOpen(false);
        setPassword('');
        setPasswordError('');
    } else if (password === 'mode123') {
         setPasswordError(language === 'bn' ? 'অনুমতিসহ কোনো মডারেটর খুঁজে পাওয়া যায়নি।' : 'No moderator with permissions found.');
    }
    else {
        setPasswordError(language === 'bn' ? 'ভুল পাসওয়ার্ড। আবার চেষ্টা করুন।' : 'Incorrect password. Please try again.');
    }
  };

  const getNavItems = (user: Member | null) => {
    return navItems.filter(item => {
        if (item.href === '/' || item.href === '/notice-board') return true; 

        if (user?.role === 'admin') {
            return true;
        }

        if(!user) return false;
        
        const hasPermission = item.permissions.length > 0 && item.permissions.some(p => user.permissions?.[p as keyof Member['permissions']]);
        if(hasPermission) {
          return true;
        }
        
        if (item.roles.includes(user.role as UserRole)) {
            if(item.href === '/dashboard') return false;
            return true;
        }

        return false;
    });
  }

  const navLinks = (
     <nav className="grid items-start gap-2 px-2 text-sm font-medium lg:px-4">
      {getNavItems(user).map(({ href, label, bn_label, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            { 'bg-muted text-primary': pathname === href }
          )}
        >
          <Icon className="h-4 w-4" />
          {language === 'bn' ? bn_label : label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <span className="font-headline text-lg tracking-tight whitespace-nowrap">HADIYA –মানবতার উপহার</span>
              </Link>
            </div>
            <div className="flex-1">
             {navLinks}
             {isClient && <LiveClock />}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">{language === 'bn' ? 'নেভিগেশন মেনু টগল করুন' : 'Toggle navigation menu'}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 mb-4">
                   <Link href="/" className="flex items-center gap-2 font-semibold">
                      <span className="font-headline text-lg tracking-tight whitespace-nowrap">HADIYA –মানবতার উপহার</span>
                  </Link>
                </div>
                {navLinks}
                {isClient && <LiveClock />}
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
              {/* Can add a search bar here if needed */}
            </div>
            <Button variant="default" onClick={() => setRegisterOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> {language === 'bn' ? 'নিবন্ধন' : 'Register'}
            </Button>
            <ThemeSwitcher />
            <LanguageSwitcher />
            <Button variant="outline" onClick={handleLoginClick}>
                {user ? (
                    <>
                        <LogOut className="mr-2 h-4 w-4" />
                        {language === 'bn' ? 'প্রস্থান' : 'Log Out'}
                    </>
                ) : (
                    <>
                        <LogIn className="mr-2 h-4 w-4" />
                        {language === 'bn' ? 'প্রবেশ' : 'Log In'}
                    </>
                )}
            </Button>
          </header>
          <main className="flex flex-1 flex-col bg-background">
            {children}
          </main>
        </div>
      </div>
      <Dialog open={isPasswordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              <ShieldCheck className="inline-block mr-2" />
              {language === 'bn' ? 'অ্যাক্সেস প্রয়োজন' : 'Access Required'}
            </DialogTitle>
            <DialogDescription>
              {language === 'bn' ? 'প্রশাসনিক বা মডারেটর ভিউতে যেতে পাসওয়ার্ড লিখুন।' : 'Please enter the password for Admin or Moderator View.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            {passwordError && (
              <p className="col-span-4 text-center text-sm text-destructive">
                {passwordError}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handlePasswordSubmit}>
              {language === 'bn' ? 'প্রবেশ করুন' : 'Enter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <RegisterMemberDialog open={isRegisterOpen} onOpenChange={setRegisterOpen} />
    </>
  );
}
