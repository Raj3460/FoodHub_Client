"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@/services/admin-dashboard.service";

interface CategoryTableProps {
  categories: Category[];
  loading: boolean;
  searchQuery: string;
  pageSize: number;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryTable({
  categories,
  loading,
  searchQuery,
  pageSize,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: pageSize }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Icon</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Order</TableHead>
            <TableHead className="w-20"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                {searchQuery
                  ? `"${searchQuery}" এর জন্য কোনো result নেই`
                  : "কোনো category নেই"}
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="text-center text-2xl">
                  {category.icon || "—"}
                </TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                <TableCell>
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={category.isActive ? "default" : "secondary"}>
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{category.displayOrder}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(category)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}