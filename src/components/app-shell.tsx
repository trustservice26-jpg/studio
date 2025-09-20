
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HeartHandshake,
  LayoutDashboard,
  Menu,
  Users,
  Home,
  ShieldCheck,
  UserPlus,
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { LanguageSwitcher } from './language-switcher';
import { LiveClock } from './live-clock';
import { RegisterMemberDialog } from './home/register-member-dialog';

const navItems = [
  { href: '/', label: 'Home', bn_label: 'হোম', icon: Home, adminOnly: false },
  { href: '/dashboard', label: 'Dashboard', bn_label: 'ড্যাশবোর্ড', icon: LayoutDashboard, adminOnly: true },
  { href: '/members', label: 'Members', bn_label: 'সদস্য', icon: Users, adminOnly: true },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userRole, setUserRole, language } = useAppContext();
  const { toast } = useToast();
  const [isPasswordDialogOpen, setPasswordDialogOpen] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [isRegisterOpen, setRegisterOpen] = React.useState(false);

  const handleRoleChange = (isAdmin: boolean) => {
    if (isAdmin) {
      setPasswordDialogOpen(true);
    } else {
      setUserRole('member');
      toast({
        title: language === 'bn' ? 'সদস্য ভিউতে स्विच করা হয়েছে' : 'Switched to Member View',
        description: language === 'bn' ? 'আপনি এখন সদস্য ভিউ মোডে আছেন।' : 'You are now in member view mode.',
      });
    }
  };

  const handlePasswordSubmit = () => {
    if (password === 'admin123') {
      setUserRole('admin');
      toast({
        title: language === 'bn' ? 'এডমিন ভিউতে स्विच করা হয়েছে' : 'Switched to Admin View',
        description: language === 'bn' ? 'আপনার এখন প্রশাসনিক বিশেষ অধিকার রয়েছে।' : 'You now have administrative privileges.',
      });
      setPasswordDialogOpen(false);
      setPassword('');
      setPasswordError('');
    } else {
      setPasswordError(language === 'bn' ? 'ভুল পাসওয়ার্ড। আবার চেষ্টা করুন।' : 'Incorrect password. Please try again.');
    }
  };

  const getNavItems = (role: 'admin' | 'member') => {
    return navItems.filter(item => !item.adminOnly || role === 'admin');
  }

  const navLinks = (
     <nav className="grid items-start gap-2 px-2 text-sm font-medium lg:px-4">
      {getNavItems(userRole).map(({ href, label, bn_label, icon: Icon }) => (
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
                <HeartHandshake className="h-6 w-6 text-primary" />
                <span className="">{language === 'bn' ? 'সেবা সংগঠন' : 'Seva Sangathan'}</span>
              </Link>
            </div>
            <div className="flex-1">
             {navLinks}
             <LiveClock />
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
                      <HeartHandshake className="h-6 w-6 text-primary" />
                      <span className="">{language === 'bn' ? 'সেবা সংগঠন' : 'Seva Sangathan'}</span>
                  </Link>
                </div>
                {navLinks}
                <LiveClock />
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
              {/* Can add a search bar here if needed */}
            </div>
            <Button onClick={() => setRegisterOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> {language === 'bn' ? 'নিবন্ধন' : 'Register'}
            </Button>
            <LanguageSwitcher />
            <div className="flex items-center space-x-2">
              <Label htmlFor="role-switch">{language === 'bn' ? 'এডমিন' : 'Admin'}</Label>
              <Switch
                id="role-switch"
                checked={userRole === 'admin'}
                onCheckedChange={handleRoleChange}
                aria-label={language === 'bn' ? 'এডমিন মোড টগল করুন' : 'Toggle admin mode'}
              />
            </div>
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
              {language === 'bn' ? 'এডমিন অ্যাক্সেস প্রয়োজন' : 'Admin Access Required'}
            </DialogTitle>
            <DialogDescription>
              {language === 'bn' ? 'এডমিন ভিউতে स्विच করতে পাসওয়ার্ড লিখুন।' : 'Please enter the password to switch to Admin View.'}
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
              {language === 'bn' ? 'এডমিন মোডে প্রবেশ করুন' : 'Enter Admin Mode'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <RegisterMemberDialog open={isRegisterOpen} onOpenChange={setRegisterOpen} />
    </>
  );
}
