// src/app/(dashbordLayout)/provider/menu/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import {
  getMyMeals,
  createMeal,
  updateMeal,
  deleteMeal,
} from "@/services/providerDashboardService/provider-meals.service";
import { getMyProfile } from "@/services/providerDashboardService/provider-profile.service";
import { CategoryService } from "@/services/category.service";
import ImageUpload from "@/components/ui/ImageUpload";
import type {
  Meal,
  MealCreatePayload,
  MealUpdatePayload,
} from "@/services/providerDashboardService/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function ProviderMenuPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Meal | null>(null);

  const [formData, setFormData] = useState<MealCreatePayload & { image?: string }>({
    providerId: "",
    name: "",
    description: "",
    price: 0,
    discountPrice: 0,
    images: [],
    thumbnail: "",
    ingredients: [],
    isSpicy: false,
    isVegetarian: false,
    preparationTime: 30,
    calories: 0,
    categoryId: "",
  });

  const [ingredientInput, setIngredientInput] = useState("");
  const [providerId, setProviderId] = useState<string>("");
  const [profileLoading, setProfileLoading] = useState(true);

  // Fetch provider profile to get providerId
  useEffect(() => {
    getMyProfile()
      .then((profile) => {
        if (profile) {
          setProviderId(profile.id);
        } else {
          toast.error("Provider profile not found. Please create your restaurant profile first.");
        }
      })
      .catch(() => toast.error("Failed to load provider profile."))
      .finally(() => setProfileLoading(false));
  }, []);

  const fetchData = async () => {
    if (!providerId) return;
    setLoading(true);
    try {
      const [mealList, catList] = await Promise.all([
        getMyMeals(),
        CategoryService.getCategories(),
      ]);
      setMeals(mealList);
      setCategories(catList as any); // assuming the service returns enough
    } catch (err) {
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerId]);

  const openCreateDialog = () => {
    setEditingMeal(null);
    setFormData({
      providerId: providerId,
      name: "",
      description: "",
      price: 0,
      discountPrice: 0,
      images: [],
      thumbnail: "",
      ingredients: [],
      isSpicy: false,
      isVegetarian: false,
      preparationTime: 30,
      calories: 0,
      categoryId: "",
    });
    setDialogOpen(true);
  };

  const openEditDialog = (meal: Meal) => {
    setEditingMeal(meal);
    setFormData({
      providerId: meal.providerId,
      name: meal.name,
      description: meal.description || "",
      price: meal.price,
      discountPrice: meal.discountPrice || 0,
      images: meal.images || [],
      thumbnail: meal.thumbnail || "",
      ingredients: meal.ingredients || [],
      isSpicy: meal.isSpicy,
      isVegetarian: meal.isVegetarian,
      preparationTime: meal.preparationTime || 30,
      calories: meal.calories || 0,
      categoryId: meal.categoryId || "",
    });
    setDialogOpen(true);
  };

  const addIngredient = () => {
    const val = ingredientInput.trim();
    if (val && !formData.ingredients?.includes(val)) {
      setFormData({
        ...formData,
        ingredients: [...(formData.ingredients || []), val],
      });
    }
    setIngredientInput("");
  };

  const removeIngredient = (item: string) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients?.filter((i) => i !== item),
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || formData.price <= 0) {
      toast.error("Name and valid price are required");
      return;
    }

    // Map formData to payload
    const payload: MealCreatePayload | MealUpdatePayload = {
      ...formData,
      price: Number(formData.price),
      discountPrice: Number(formData.discountPrice) || undefined,
      preparationTime: Number(formData.preparationTime) || undefined,
      calories: Number(formData.calories) || undefined,
    };

    let success = false;
    if (editingMeal) {
      const updated = await updateMeal(editingMeal.id, payload as MealUpdatePayload);
      success = !!updated;
    } else {
      const created = await createMeal(payload as MealCreatePayload);
      success = !!created;
    }

    if (success) {
      toast.success(editingMeal ? "Meal updated" : "Meal created");
      fetchData();
      setDialogOpen(false);
    } else {
      toast.error("Failed to save meal");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const ok = await deleteMeal(deleteTarget.id);
    if (ok) {
      toast.success("Meal deleted");
      fetchData();
    } else {
      toast.error("Failed to delete meal");
    }
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Menu</h1>
          <p className="text-muted-foreground">Manage your food items</p>
        </div>
        <Button onClick={openCreateDialog} disabled={profileLoading || !providerId}>
          <Plus className="mr-2 h-4 w-4" /> Add Meal
        </Button>
      </div>

      {loading || profileLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : !providerId ? (
        <div className="text-center py-10 text-muted-foreground">
          Please create your restaurant profile first.
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Available</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No meals yet. Click &quot;Add Meal&quot; to start.
                  </TableCell>
                </TableRow>
              ) : (
                meals.map((meal) => (
                  <TableRow key={meal.id}>
                    <TableCell className="font-medium">{meal.name}</TableCell>
                    <TableCell>{meal.category?.name || "—"}</TableCell>
                    <TableCell>৳{meal.price}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {meal.rating.toFixed(1)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={meal.isAvailable ? "default" : "secondary"}>
                        {meal.isAvailable ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(meal)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(meal)}>
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
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingMeal ? "Edit Meal" : "Add New Meal"}</DialogTitle>
            <DialogDescription>
              {editingMeal ? "Update your meal details" : "Fill in the details for your new meal"}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 space-y-4 pr-1">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={formData.categoryId || ""}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Price (৳)</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: +e.target.value })}
                />
              </div>
              <div>
                <Label>Discount Price</Label>
                <Input
                  type="number"
                  value={formData.discountPrice || ""}
                  onChange={(e) => setFormData({ ...formData, discountPrice: +e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Preparation Time (min)</Label>
                <Input
                  type="number"
                  value={formData.preparationTime || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, preparationTime: +e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Calories</Label>
                <Input
                  type="number"
                  value={formData.calories || ""}
                  onChange={(e) => setFormData({ ...formData, calories: +e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>

            <div>
              <Label>Ingredients</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addIngredient();
                    }
                  }}
                  placeholder="Add ingredient"
                />
                <Button variant="outline" size="sm" onClick={addIngredient}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.ingredients?.map((ing) => (
                  <Badge
                    key={ing}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeIngredient(ing)}
                  >
                    {ing} ✕
                  </Badge>
                ))}
              </div>
            </div>

            <ImageUpload
              label="Meal Image"
              value={formData.thumbnail || (formData.images?.length ? formData.images[0] : "")}
              onChange={(url) =>
                setFormData({
                  ...formData,
                  thumbnail: url,
                  images: [url],
                })
              }
              previewClassName="h-20 w-20 rounded-xl object-cover border"
            />

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isSpicy}
                  onCheckedChange={(checked) => setFormData({ ...formData, isSpicy: checked })}
                />
                <Label>Spicy</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isVegetarian}
                  onCheckedChange={(checked) => setFormData({ ...formData, isVegetarian: checked })}
                />
                <Label>Vegetarian</Label>
              </div>
            </div>
          </div>
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingMeal ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Meal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}