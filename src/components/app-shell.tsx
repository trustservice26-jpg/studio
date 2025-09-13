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

const navItems = [
  { href: '/', label: 'Home', icon: Home, adminOnly: false },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: true },
  { href: '/members', label: 'Members', icon: Users, adminOnly: true },
  { href: '/donations', label: 'Donations', icon: HeartHandshake, adminOnly: true },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userRole, setUserRole } = useAppContext();
  const { toast } = useToast();
  const [isPasswordDialogOpen, setPasswordDialogOpen] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');

  const handleRoleChange = (isAdmin: boolean) => {
    if (isAdmin) {
      setPasswordDialogOpen(true);
    } else {
      setUserRole('member');
      toast({
        title: 'Switched to Member View',
        description: 'You are now in member view mode.',
      });
    }
  };

  const handlePasswordSubmit = () => {
    if (password === 'admin123') {
      setUserRole('admin');
      toast({
        title: 'Switched to Admin View',
        description: 'You now have administrative privileges.',
      });
      setPasswordDialogOpen(false);
      setPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const getNavItems = (role: 'admin' | 'member') => {
    return navItems.filter(item => !item.adminOnly || role === 'admin');
  }

  const navLinks = (
    <nav className="grid items-start gap-2 px-2 text-sm font-medium lg:px-4">
      {getNavItems(userRole).map(({ href, label, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            { 'bg-muted text-primary': pathname === href }
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
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
                <span className="">Seva Sangathan</span>
              </Link>
            </div>
            <div className="flex-1">
             {navLinks}
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
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 mb-4">
                   <Link href="/" className="flex items-center gap-2 font-semibold">
                      <HeartHandshake className="h-6 w-6 text-primary" />
                      <span className="">Seva Sangathan</span>
                  </Link>
                </div>
                {navLinks}
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
              {/* Can add a search bar here if needed */}
            </div>
            <LanguageSwitcher />
            <div className="flex items-center space-x-2">
              <Label htmlFor="role-switch">Admin</Label>
              <Switch
                id="role-switch"
                checked={userRole === 'admin'}
                onCheckedChange={handleRoleChange}
                aria-label="Toggle admin mode"
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
              Admin Access Required
            </DialogTitle>
            <DialogDescription>
              Please enter the password to switch to Admin View.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
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
              Enter Admin Mode
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
