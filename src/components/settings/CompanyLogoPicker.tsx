"use client";

import Image from "next/image";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";

export default function CompanyLogoPicker({
  currentUrl,
  selectedFile,
  removeRequested,
  readOnly,
  onFileChange,
  onRemove,
}: {
  currentUrl: string;
  selectedFile: File | null;
  removeRequested: boolean;
  readOnly: boolean;
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
}) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [failedUrl, setFailedUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }
    const next = URL.createObjectURL(selectedFile);
    setPreviewUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [selectedFile]);

  const shownUrl = previewUrl || (!removeRequested ? currentUrl : "");
  function choose(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Use a JPEG, PNG, or WebP logo.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("The company logo must be 5 MB or smaller.");
      return;
    }
    setError(null);
    setFailedUrl("");
    onFileChange(file);
  }

  return (
    <div className="flex w-full shrink-0 flex-col items-center sm:w-52">
      <div className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-3">
        {shownUrl && failedUrl !== shownUrl ? (
          <Image
            src={shownUrl}
            alt="Company logo preview"
            fill
            loader={({ src }) => src}
            unoptimized
            onError={() => setFailedUrl(shownUrl)}
            className="object-contain p-3"
          />
        ) : (
          <div className="text-center">
            <ImageIcon className="mx-auto h-7 w-7 text-slate-400" />
            <span className="mt-2 block text-xs font-semibold text-slate-400">
              No company logo
            </span>
          </div>
        )}
      </div>
      {!readOnly && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl border border-[#0E9384] px-3 text-xs font-semibold text-[#0E9384]">
            <Upload className="h-4 w-4" />
            {shownUrl ? "Replace" : "Upload"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => {
                choose(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>
          {shownUrl && (
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-rose-200 px-3 text-xs font-semibold text-rose-600"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          )}
        </div>
      )}
      <p className="mt-2 max-w-48 text-center text-[10px] leading-relaxed text-slate-400">
        Recommended: square PNG, JPEG or WebP · maximum 5 MB
      </p>
      {selectedFile && (
        <p className="mt-1 max-w-48 truncate text-center text-[10px] font-semibold text-[#0E9384]">
          Ready: {selectedFile.name}
        </p>
      )}
      {error && (
        <p className="mt-2 text-center text-[10px] font-semibold text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
