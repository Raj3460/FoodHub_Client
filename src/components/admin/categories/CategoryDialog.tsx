"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ui/ImageUpload";
import { Category } from "@/services/admin-dashboard.service";

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  displayOrder: number;
  isActive: boolean;
}

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: Category | null;
  formData: CategoryFormData;
  onFormChange: (data: CategoryFormData) => void;
  onSubmit: () => void;
}

const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export function CategoryDialog({
  open,
  onOpenChange,
  editingCategory,
  formData,
  onFormChange,
  onSubmit,
}: CategoryDialogProps) {
  const handleNameChange = (name: string) => {
    if (!editingCategory) {
      // নতুন → slug auto-generate
      onFormChange({ ...formData, name, slug: generateSlug(name) });
    } else {
      onFormChange({ ...formData, name });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? "Edit Category" : "New Category"}
          </DialogTitle>
          <DialogDescription>
            {editingCategory
              ? "Update the category details, icon, and image."
              : "Add a new food category with all details."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 overflow-y-auto flex-1 pr-1">
          <div>
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Biryani"
            />
          </div>
          <div>
            <Label>Slug</Label>
            <Input
              value={formData.slug}
              onChange={(e) =>
                onFormChange({ ...formData, slug: e.target.value })
              }
              placeholder="auto-generated-or-edit"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Used in URLs. Auto-generated from name if left empty.
            </p>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                onFormChange({ ...formData, description: e.target.value })
              }
              placeholder="Short description..."
              rows={3}
            />
          </div>
          <div>
            <Label>Icon (emoji)</Label>
            <Input
              value={formData.icon}
              onChange={(e) =>
                onFormChange({ ...formData, icon: e.target.value })
              }
              placeholder="e.g. 🍛"
            />
          </div>
          <ImageUpload
            label="Category Image"
            value={formData.image}
            onChange={(url) =>
              onFormChange({ ...formData, image: url })
            }
            showUrlInput={true}
            previewClassName="h-16 w-16 rounded-full object-cover border"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Display Order</Label>
              <Input
                type="number"
                value={formData.displayOrder}
                onChange={(e) =>
                  onFormChange({
                    ...formData,
                    displayOrder: parseInt(e.target.value) || 0,
                  })
                }
                min={0}
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  onFormChange({ ...formData, isActive: checked })
                }
              />
              <Label>Active</Label>
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            {editingCategory ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}