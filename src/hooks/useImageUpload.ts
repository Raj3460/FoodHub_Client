import { useState } from "react";
import { toast } from "sonner";

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      // কোনো extra header লাগবে না, শুধু credentials: 'include'
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: "POST",
        credentials: "include", // ✅ সেশন কুকি অটো যাবে
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || `Upload failed (${res.status})`);
        console.error("Upload error:", data);
        return null;
      }

      if (data.success) {
        return data.url; // Cloudinary URL
      } else {
        toast.error(data.message || "Upload failed");
        return null;
      }
    } catch (error) {
      toast.error("Network error");
      console.error(error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading };
};