"use client";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentMedia,
  AttachmentTrigger,
} from "@/components/ui/attachment";
import { IconCamera, IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import React, { useRef, useState } from "react";

interface ProfileAvatarUploadProps {
  initialAvatarUrl?: string;
}

export function ProfileAvatarUpload({ initialAvatarUrl }: ProfileAvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialAvatarUrl || null);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "done">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a local blob url for instant preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Set uploading simulation
    setUploadState("uploading");
    
    setTimeout(() => {
      setUploadState("done");
    }, 800); // Simulate network upload speed
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering file selection
    setPreviewUrl(null);
    setUploadState("idle");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Attachment
        state={uploadState === "uploading" ? "uploading" : "done"}
        className="w-28 h-28 min-w-0 aspect-square rounded-full border border-hairline-soft bg-cloud/30 flex items-center justify-center relative group"
      >
        {/* Hidden Input field */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Media Preview (Circular Avatar Style) */}
        <AttachmentMedia
          variant="image"
          className="w-full h-full rounded-full overflow-hidden absolute inset-0 shrink-0 select-none pointer-events-none"
        >
          {previewUrl ? (
            <Image
              width={100}
              height={100}
              src={previewUrl}
              alt="Profile Avatar"
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-75"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-cloud text-ink/30 text-2xl font-bold font-sans">
              RA
            </div>
          )}
        </AttachmentMedia>

        {/* Circular Action Overlay (Camera Icon) */}
        <AttachmentTrigger
          onClick={() => fileInputRef.current?.click()}
          className="absolute right-0 bottom-0 bg-ink hover:bg-charcoal text-canvas p-2 rounded-full shadow-md transition-colors cursor-pointer border border-canvas flex items-center justify-center z-30"
        >
          <IconCamera size={14} />
        </AttachmentTrigger>

        {/* Action button to delete/remove image */}
        {previewUrl && (
          <AttachmentActions className="absolute -top-1.5 -right-1.5 z-40">
            <AttachmentAction
              variant="outline"
              size="icon-xs"
              onClick={handleRemove}
              className="rounded-full bg-canvas text-sale border-hairline-soft shadow hover:bg-sale/5 h-6 w-6 cursor-pointer"
            >
              <IconTrash size={12} />
            </AttachmentAction>
          </AttachmentActions>
        )}
      </Attachment>

      {/* Helper text button description */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="text-[10px] font-bold uppercase tracking-wider text-mute hover:text-ink transition-colors cursor-pointer font-sans"
      >
        Change Photo
      </button>

      <span className="text-[9px] text-mute font-sans leading-none">
        JPG, PNG or WEBP. Max size 2MB.
      </span>
    </div>
  );
}
