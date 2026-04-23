"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star } from "lucide-react";
import { providerDashboardService, Meal } from "@/services/provider-dashboard.service";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderMenuPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchMeals = async () => {
      const data = await providerDashboardService.getMeals();
      setMeals(data);
      setLoading(false);
    };
    fetchMeals();
  }, []);

  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Menu</h1>
        <p className="text-muted-foreground">Manage your restaurant menu items</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search meals..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMeals.map((meal) => (
                <TableRow key={meal.id}>
                  <TableCell>
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-gray-100">
                      {meal.thumbnail ? (
                        <Image src={meal.thumbnail} alt={meal.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-lg font-bold text-gray-400">
                          {meal.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{meal.name}</TableCell>
                  <TableCell>₹{meal.price}</TableCell>
                  <TableCell>
                    <Badge variant={meal.isAvailable ? "default" : "secondary"}>
                      {meal.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell>{meal.totalOrders || 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{meal.rating?.toFixed(1) || "New"}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}