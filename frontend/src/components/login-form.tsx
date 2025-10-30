'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase/provider';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();

  const handleSignIn = () => {
    if (email && password) {
      initiateEmailSignIn(auth, email, password);
    }
  };

  const handleSignUp = () => {
    if (email && password) {
      initiateEmailSignUp(auth, email, password);
    }
  };

  return (
    <Card className="w-full max-w-sm bg-transparent border-0 shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Welcome</CardTitle>
        <CardDescription>
          Sign in or create an account to join the arena.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSignIn} className="w-full">Sign In</Button>
          <Button onClick={handleSignUp} className="w-full">Sign Up</Button>
        </div>
      </CardContent>
    </Card>
  );
}
