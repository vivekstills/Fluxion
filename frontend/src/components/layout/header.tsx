'use client';
import { usePathname } from 'next/navigation';
import PillNav from '@/components/pill-nav';
import logo from '@/assets/logo.svg';

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

  return (
    <header className="fixed top-0 left-0 w-full z-50 p-4 flex justify-center">
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
    </header>
  );
}
