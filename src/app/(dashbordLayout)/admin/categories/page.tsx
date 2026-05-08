"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { adminDashboardService, Category } from "@/services/admin-dashboard.service";
import { toast } from "sonner";
import { CategoryTable } from "@/components/admin/categories/CategoryTable";
import { CategoryPagination } from "@/components/admin/categories/CategoryPagination";
import { CategoryDialog, CategoryFormData } from "@/components/admin/categories/CategoryDialog";
import { CategoryDeleteAlert } from "@/components/admin/categories/CategoryDeleteAlert";

const ITEMS_PER_PAGE = 8;

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    description: "",
    icon: "",
    image: "",
    displayOrder: 0,
    isActive: true,
  });

  // প্রথম লোড
  const fetchCategories = async () => {
    const data = await adminDashboardService.getCategories();
    setCategories(data);
    setInitialLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ডিবাউন্স সার্চ
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // new-to-old sort
  const sortedCategories = useMemo(() => {
    return [...categories].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [categories]);

  // ফিল্টারিং
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return sortedCategories;
    return sortedCategories.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedCategories, searchQuery]);

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ডায়ালগ ওপেন
  const openCreateDialog = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "",
      image: "",
      displayOrder: 0,
      isActive: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      icon: category.icon || "",
      image: category.image || "",
      displayOrder: category.displayOrder ?? 0,
      isActive: category.isActive ?? true,
    });
    setDialogOpen(true);
  };

 
  const handleSubmit = async () => {
  if (!formData.name.trim()) {
    toast.error("Name is required");
    return;
  }

  const payload = {
    name: formData.name.trim(),
    slug: formData.slug.trim() || "",
    description: formData.description.trim(),
    icon: formData.icon.trim(),
    image: formData.image.trim(),
    displayOrder: Number(formData.displayOrder) || 0,
    isActive: formData.isActive,
  };

  if (editingCategory) {
    // 🔁 অপ্টিমিস্টিক আপডেট (locally update)
    const backup = [...categories];
    setCategories((prev) =>
      prev.map((c) => (c.id === editingCategory.id ? { ...c, ...payload } : c))
    );
    setDialogOpen(false);

    const success = await adminDashboardService.updateCategory(editingCategory.id, payload);
    if (!success) {
      // revert
      setCategories(backup);
      toast.error("Update failed");
    } else {
      toast.success("Category updated");
    }
  } else {
    // ➕ অপ্টিমিস্টিক ক্রিয়েট
    const tempId = "temp_" + Date.now();
    const newCat: Category = {
      id: tempId,
      ...payload,
      description: payload.description || null,
      icon: payload.icon || null,
      image: payload.image || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _count: { meals: 0 },
    } as Category; // জোর করে টাইপ কাস্ট (temp ডেটা, পরে রিপ্লেস হবে)

    setCategories((prev) => [...prev, newCat]);
    setDialogOpen(false);
    setCurrentPage(1);

    const result = await adminDashboardService.createCategory(payload);
    // result হতে পারে boolean বা created object.
    // যদি boolean true হয়, তাহলে আমরা tempId টা রেখে দিব, কিন্তু পরবর্তী রিফ্রেশে সঠিক ডেটা চলে আসবে।
    // তবে ইউজার এক্সপেরিয়েন্স ভালো রাখতে, যদি result অবজেক্ট হয় (id সহ) তাহলে রিপ্লেস করব।
    if (result === false) {
      // ব্যর্থ
      setCategories((prev) => prev.filter((c) => c.id !== tempId));
      toast.error("Create failed");
    } else if (typeof result === "object" && result !== null && "id" in result) {
      // সার্ভার থেকে আসল অবজেক্ট পেয়েছি
      setCategories((prev) =>
        prev.map((c) => (c.id === tempId ? result as Category : c))
      );
      toast.success("Category created");
    } else {
      // শুধু true পেয়েছি (আসল অবজেক্ট নেই), tempId টি রেখে দিচ্ছি – পরবর্তী fetchAuto করলে ঠিক হবে
      toast.success("Category created");
    }
  }
};

  // ডিলিট
  const handleDeleteRequest = (category: Category) => {
    setDeletingCategory(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingCategory) return;
    const backup = [...categories];
    setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
    setDeleteDialogOpen(false);
    const success = await adminDashboardService.deleteCategory(deletingCategory.id);
    if (success) {
      toast.success("Category deleted");
    } else {
      setCategories(backup);
      toast.error("Failed to delete category");
    }
    setDeletingCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Categories Management
          </h1>
          <p className="text-muted-foreground">
            Manage food categories with icons and images
          </p>
        </div>
        <Button onClick={openCreateDialog} className="hidden sm:inline-flex">
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        {!initialLoading && (
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            {filteredCategories.length} result
            {filteredCategories.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Table */}
      <CategoryTable
        categories={paginatedCategories}
        loading={initialLoading}
        searchQuery={searchQuery}
        pageSize={ITEMS_PER_PAGE}
        onEdit={openEditDialog}
        onDelete={handleDeleteRequest}
      />

      {/* Pagination */}
      <CategoryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Mobile FAB */}
      <Button
        onClick={openCreateDialog}
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg sm:hidden bg-primary/80 backdrop-blur-sm"
        aria-label="Add Category"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingCategory={editingCategory}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleSubmit}
      />

      <CategoryDeleteAlert
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        target={deletingCategory}
        onConfirm={confirmDelete}
      />
    </div>
  );
}