"use client";

import { Film, ImagePlus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type StoredVideo = { id: string; url: string; originalName?: string | null };

function PreviewImage({ file }: { file: File }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const next = URL.createObjectURL(file);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);
  return url ? (
    <Image
      src={url}
      alt={file.name}
      fill
      unoptimized
      className="object-cover"
    />
  ) : null;
}

function PreviewVideo({ file }: { file: File }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const next = URL.createObjectURL(file);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);
  return url ? (
    <video
      src={url}
      controls
      preload="metadata"
      className="aspect-video w-full rounded-xl bg-slate-950 object-contain"
    />
  ) : null;
}

export default function ProductMediaUploadFields({
  imageFiles,
  onImagesChange,
  videoFile,
  onVideoChange,
  existingVideo,
  removeExistingVideo,
  onRemoveExistingVideoChange,
  currentImageCount,
  onMessage,
}: {
  imageFiles: File[];
  onImagesChange: (files: File[]) => void;
  videoFile: File | null;
  onVideoChange: (file: File | null) => void;
  existingVideo?: StoredVideo;
  removeExistingVideo: boolean;
  onRemoveExistingVideoChange: (remove: boolean) => void;
  currentImageCount: number;
  onMessage: (message: string | null) => void;
}) {
  function chooseImages(files: FileList | null) {
    const selected = Array.from(files ?? []);
    if (!selected.length) return;
    if (currentImageCount + imageFiles.length + selected.length > 8)
      return onMessage("A product can contain up to eight images.");
    const invalid = selected.find(
      (file) =>
        !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
          file.type,
        ) || file.size > 8 * 1024 * 1024,
    );
    if (invalid)
      return onMessage(
        `${invalid.name} must be a JPEG, PNG, WebP, or GIF no larger than 8 MB.`,
      );
    onImagesChange([...imageFiles, ...selected]);
    onMessage(null);
  }

  function chooseVideo(file?: File) {
    if (!file) return;
    if (!["video/mp4", "video/webm"].includes(file.type))
      return onMessage("Use an MP4 or WebM product video.");
    if (file.size > 50 * 1024 * 1024)
      return onMessage("The product video must be 50 MB or smaller.");
    onVideoChange(file);
    onRemoveExistingVideoChange(Boolean(existingVideo));
    onMessage(null);
  }

  const shownVideo = !removeExistingVideo ? existingVideo : undefined;
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b px-5 py-4">
        <span className="rounded-xl bg-teal-50 p-2 text-[#0E9384]">
          <Upload className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-bold">Upload product media</h2>
          <p className="text-xs text-slate-500">
            Files are stored in MinIO. Images appear in product cards; an
            optional video can be played in POS.
          </p>
        </div>
      </div>
      <div className="grid gap-6 p-5 xl:grid-cols-2">
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <ImagePlus className="h-4 w-4 text-[#0E9384]" />
                Images
              </h3>
              <p className="text-xs text-slate-500">
                JPEG, PNG, WebP or GIF · 8 MB each · 8 total
              </p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#0E9384] px-3 py-2 text-xs font-semibold text-[#0E9384]">
              <Upload className="h-4 w-4" />
              Choose
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="sr-only"
                onChange={(event) => {
                  chooseImages(event.target.files);
                  event.target.value = "";
                }}
              />
            </label>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {imageFiles.map((file, index) => (
              <div
                key={`${file.name}-${file.lastModified}`}
                className="overflow-hidden rounded-xl border border-teal-200 bg-teal-50"
              >
                <div className="relative aspect-[4/3]">
                  <PreviewImage file={file} />
                </div>
                <div className="flex items-center justify-between gap-2 p-2">
                  <span className="truncate text-[10px] font-semibold">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onImagesChange(
                        imageFiles.filter((_, position) => position !== index),
                      )
                    }
                    className="text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {imageFiles.length === 0 && (
            <div className="mt-4 rounded-xl border border-dashed p-6 text-center text-xs text-slate-400">
              Choose images to upload when the product is saved.
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Film className="h-4 w-4 text-[#0E9384]" />
                Product video{" "}
                <span className="font-normal text-slate-400">(optional)</span>
              </h3>
              <p className="text-xs text-slate-500">
                MP4 or WebM · 50 MB maximum
              </p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#0E9384] px-3 py-2 text-xs font-semibold text-[#0E9384]">
              <Upload className="h-4 w-4" />
              {shownVideo || videoFile ? "Replace" : "Choose"}
              <input
                type="file"
                accept="video/mp4,video/webm"
                className="sr-only"
                onChange={(event) => {
                  chooseVideo(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </label>
          </div>
          <div className="mt-4">
            {videoFile ? (
              <PreviewVideo file={videoFile} />
            ) : shownVideo ? (
              <video
                src={shownVideo.url}
                controls
                preload="metadata"
                className="aspect-video w-full rounded-xl bg-slate-950 object-contain"
              />
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed text-xs text-slate-400">
                <Film className="mr-2 h-5 w-5" />
                No video selected.
              </div>
            )}
          </div>
          {(shownVideo || videoFile) && (
            <button
              type="button"
              onClick={() => {
                onVideoChange(null);
                onRemoveExistingVideoChange(Boolean(existingVideo));
              }}
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-rose-600"
            >
              <Trash2 className="h-4 w-4" />
              Remove video
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
