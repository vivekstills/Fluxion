'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function OrderPanel() {
  return (
    <Card className="bg-gray-900 text-white">
      <CardHeader>
        <CardTitle>Order Panel</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="qty">Quantity</Label>
          <Input id="qty" type="number" placeholder="0.00" className="bg-gray-800 border-gray-700" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="limit">Limit Price</Label>
          <Input id="limit" type="number" placeholder="0.00" className="bg-gray-800 border-gray-700" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button className="bg-emerald-500 hover:bg-emerald-600">Market Buy</Button>
          <Button className="bg-rose-500 hover:bg-rose-600">Market Sell</Button>
          <Button variant="secondary">Limit Buy</Button>
          <Button variant="secondary">Limit Sell</Button>
        </div>
      </CardContent>
    </Card>
  );
}
