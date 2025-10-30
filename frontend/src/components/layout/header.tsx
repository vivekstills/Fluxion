'use client';
import { usePathname } from 'next/navigation';
import PillNav from '@/components/pill-nav';
import logo from '@/assets/logo.svg';
import { useUser, useAuth } from '@/firebase/provider';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LoginForm } from '@/components/login-form';
import { CustomWalletButton } from '@/components/custom-wallet-button';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Trader Cards', href: '/trader-cards' },
  { label: 'Battle', href: '/battle' },
  { label: 'Markets', href: '/markets' },
  { label: 'Leagues', href: '/leagues' },
  { label: 'Rewards', href: '/rewards' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Learn', href: '/learn' },
];

export function Header() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 p-4 flex justify-between items-center">
      <PillNav
        logo={logo}
        logoAlt="Fluxion Arena Logo"
        items={navItems}
        activeHref={pathname}
        baseColor="transparent"
        pillColor="hsl(var(--card) / 0.6)"
        hoveredPillTextColor="hsl(var(--primary))"
        pillTextColor="hsl(var(--primary-foreground))"
      />
      <div className="flex items-center gap-4">
        <CustomWalletButton />
        {isUserLoading ? (
          <div className="w-24 h-8 bg-gray-700 rounded animate-pulse" />
        ) : user ? (
          <div className="font-headline flex items-center gap-4 bg-black/10 backdrop-blur-sm border border-white/10 rounded-full p-2 pr-4">
            <span className="text-sm text-gray-300 pl-2 font-mono">{user.email}</span>
            <Button onClick={handleSignOut} size="sm" variant="ghost" className="rounded-full">Sign Out</Button>
          </div>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" className="font-headline login-button">Login</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-black/30 backdrop-blur-lg border-white/10 text-white">
              <LoginForm />
            </PopoverContent>
          </Popover>
        )}
      </div>
    </header>
  );
}
