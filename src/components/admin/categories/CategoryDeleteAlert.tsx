"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Category } from "@/services/admin-dashboard.service";

interface CategoryDeleteAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: Category | null;
  onConfirm: () => void;
}

export function CategoryDeleteAlert({
  open,
  onOpenChange,
  target,
  onConfirm,
}: CategoryDeleteAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">
              "{target?.name}"
            </span>{" "}
            category টি permanently delete হয়ে যাবে। এই কাজ undo করা যাবে না।
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}