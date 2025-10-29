'use client';
import {
  BarChart3,
  BookOpen,
  CreditCard,
  Gift,
  LayoutDashboard,
  Package2,
  Trophy,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/trader-cards', label: 'Trader Cards', icon: CreditCard },
  { href: '/leagues', label: 'Leagues', icon: Trophy },
  { href: '/rewards', label: 'Daily Rewards', icon: Gift },
  { href: '/leaderboard', label: 'Leaderboard', icon: BarChart3 },
  { href: '/learn', label: 'Learn', icon: BookOpen },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <div className="flex w-full items-center justify-center p-2 group-data-[collapsible=icon]:hidden">
          <Link href="/dashboard" className="flex items-center gap-2 font-headline text-xl font-semibold">
            <Package2 className="h-6 w-6 text-primary" />
            <span>Fluxion Arena</span>
          </Link>
        </div>
        <div className="hidden items-center justify-center p-2 group-data-[collapsible=icon]:flex">
            <Package2 className="h-6 w-6 text-primary" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                className={cn('font-headline', {
                  'bg-sidebar-accent': pathname === item.href,
                })}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
