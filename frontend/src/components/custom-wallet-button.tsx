'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function CustomWalletButton() {
  const { wallets, select, connected, disconnect, publicKey } = useWallet();

  if (connected) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-mono">{publicKey?.toBase58().slice(0, 8)}...</span>
        <Button onClick={() => disconnect()} size="sm" variant="ghost">Disconnect</Button>
      </div>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" className="font-headline login-button">Connect Wallet</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-black/30 backdrop-blur-lg border-white/10 text-white">
        <div className="grid gap-4">
          <h4 className="font-medium leading-none">Select Wallet</h4>
          <div className="grid gap-2">
            {wallets.map((wallet) => (
              <Button
                key={wallet.adapter.name}
                onClick={() => select(wallet.adapter.name)}
                variant="outline"
              >
                {wallet.adapter.name}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
