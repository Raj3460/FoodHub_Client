"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, CheckCircle, XCircle, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminDashboardService, Provider } from "@/services/admin-dashboard.service";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProviders = async () => {
    setLoading(true);
    const data = await adminDashboardService.getProviders();
    setProviders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const approveProvider = async (id: string, isApproved: boolean) => {
    const success = await adminDashboardService.approveProvider(id, isApproved);
    if (success) {
      toast.success(`Provider ${isApproved ? "approved" : "rejected"}`);
      fetchProviders();
    } else {
      toast.error("Failed to update status");
    }
  };

  const toggleFeatured = async (id: string, isFeatured: boolean) => {
    const success = await adminDashboardService.toggleFeatured(id, isFeatured);
    if (success) {
      toast.success(`Provider ${isFeatured ? "featured" : "unfeatured"}`);
      fetchProviders();
    } else {
      toast.error("Failed to update featured status");
    }
  };

  const filteredProviders = providers.filter(
    (p) =>
      p.restaurantName?.toLowerCase().includes(search.toLowerCase()) ||
      p.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Providers Management</h1>
        <p className="text-muted-foreground">Manage all restaurant providers</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by restaurant or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
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
                <TableHead>Restaurant</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProviders.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium">{provider.restaurantName}</TableCell>
                  <TableCell>
                    <div>{provider.contactPhone}</div>
                    <div className="text-xs text-muted-foreground">{provider.contactEmail}</div>
                  </TableCell>
                  <TableCell>{provider.city}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{provider.rating?.toFixed(1) || "New"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={provider.isApproved ? "default" : "secondary"}>
                      {provider.isApproved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={provider.isFeatured ? "default" : "secondary"}>
                      {provider.isFeatured ? "Featured" : "Normal"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!provider.isApproved && (
                          <DropdownMenuItem onClick={() => approveProvider(provider.id, true)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {provider.isApproved && (
                          <DropdownMenuItem onClick={() => approveProvider(provider.id, false)}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => toggleFeatured(provider.id, !provider.isFeatured)}>
                          <Star className="mr-2 h-4 w-4" />
                          {provider.isFeatured ? "Remove Featured" : "Make Featured"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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