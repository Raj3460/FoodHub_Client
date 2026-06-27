// src/app/(dashbordLayout)/provider/profile/_components/profile-header.tsx
"use client";

import { CheckCircle2, XCircle, Save, UserPlus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  profileExists: boolean;
  saving: boolean;
  coverImage?: string;
  logo?: string;
  restaurantName?: string;
  branch?: string;
  city?: string;
  isApproved?: boolean;
  rating?: number;
  totalReviews?: number;
  totalOrders?: number;
  isOpen?: boolean;
  onSave: () => void;
}

export function ProfileHeader({
  profileExists,
  saving,
  coverImage,
  logo,
  restaurantName,
  branch,
  city,
  isApproved,
  rating,
  totalReviews,
  totalOrders,
  isOpen,
  onSave,
}: ProfileHeaderProps) {
  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-card">
      {/* Cover */}
      <div className="relative h-40 w-full bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        {coverImage ? (
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover opacity-80" />
        ) : (
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        )}
        {/* Badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          {profileExists && (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
              isApproved
                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
            }`}>
              {isApproved
                ? <><CheckCircle2 className="h-3 w-3" /> Approved</>
                : <><XCircle className="h-3 w-3" /> Pending</>}
            </span>
          )}
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
            isOpen
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-emerald-400" : "bg-gray-400"}`} />
            {isOpen ? "Open" : "Closed"}
          </span>
        </div>
        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Profile info row */}
      <div className="px-6 pb-5">
        <div className="flex items-end gap-4 -mt-8 mb-4">
          {/* Logo */}
          <div className="w-16 h-16 rounded-xl border-2 border-card bg-card flex items-center justify-center overflow-hidden shadow shrink-0">
            {logo ? (
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl text-muted-foreground">🍽️</span>
            )}
          </div>

          {/* Name */}
          <div className="flex-1 min-w-0 pt-6">
            <h2 className="text-lg font-semibold text-foreground truncate">
              {restaurantName || "Your Restaurant"}
            </h2>
            <p className="text-sm text-muted-foreground truncate">
              {[branch, city].filter(Boolean).join(" · ") || "Add branch & city below"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-6 shrink-0">
            {profileExists && (
              <Button variant="outline" size="sm" className="gap-1.5">
                <Eye className="h-3.5 w-3.5" /> Preview
              </Button>
            )}
            <Button
              size="sm"
              disabled={saving}
              onClick={onSave}
              className="gap-1.5 text-white"
              style={{ background: "var(--brand-primary)" }}
            >
              {profileExists
                ? <><Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Save changes"}</>
                : <><UserPlus className="h-3.5 w-3.5" /> {saving ? "Creating..." : "Create profile"}</>}
            </Button>
          </div>
        </div>

        {/* Stats row */}
        {profileExists && (
          <div className="flex gap-5 pt-3 border-t border-border flex-wrap">
            {(rating ?? 0) > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-amber-500 text-sm">⭐</span>
                <span className="text-sm font-semibold text-foreground">{rating?.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({totalReviews} reviews)</span>
              </div>
            )}
            {(totalOrders ?? 0) > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-foreground">{totalOrders}</span>
                <span className="text-xs text-muted-foreground">orders</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}