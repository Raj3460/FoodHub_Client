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

      {/* Cover — logo sits absolutely at bottom-left */}
      <div className="relative h-32 sm:h-40 w-full bg-gradient-to-br from-gray-800 to-gray-900">
        {coverImage ? (
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover opacity-80" />
        ) : (
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        )}

        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Badges — top right */}
        <div className="absolute top-3 right-3 flex gap-2 flex-wrap justify-end">
          {profileExists && (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isApproved
                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
            }`}>
              {isApproved
                ? <><CheckCircle2 className="h-3 w-3" /> Approved</>
                : <><XCircle className="h-3 w-3" /> Pending</>}
            </span>
          )}
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isOpen
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-emerald-400" : "bg-gray-400"}`} />
            {isOpen ? "Open" : "Closed"}
          </span>
        </div>

        {/* ✅ Logo — absolute, sits on cover bottom, half goes below */}
        <div className="absolute -bottom-7 left-4 sm:left-6 w-14 h-14 sm:w-20 sm:h-20 rounded-xl border-[3px] border-card bg-card flex items-center justify-center overflow-hidden shadow-md z-10">
          {logo ? (
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl sm:text-2xl">🍽️</span>
          )}
        </div>
      </div>

      {/* Content below cover */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-10 sm:pt-11">

        {/* Name + Actions */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-foreground truncate leading-tight">
              {restaurantName || "Your Restaurant"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground truncate mt-0.5">
              {[branch, city].filter(Boolean).join(" · ") || "Add branch & city below"}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 shrink-0">
            {profileExists && (
              <Button variant="outline" size="sm" className="gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
            )}
            <Button
              size="sm"
              disabled={saving}
              onClick={onSave}
              className="gap-1.5 text-white"
              style={{ background: "var(--brand-primary)" }}
            >
              {profileExists ? (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{saving ? "Saving..." : "Save changes"}</span>
                  <span className="sm:hidden">{saving ? "..." : "Save"}</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{saving ? "Creating..." : "Create profile"}</span>
                  <span className="sm:hidden">{saving ? "..." : "Create"}</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats row */}
        {profileExists && ((rating ?? 0) > 0 || (totalOrders ?? 0) > 0) && (
          <div className="flex gap-4 pt-3 border-t border-border flex-wrap">
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