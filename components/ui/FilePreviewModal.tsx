"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink, Download, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string | null;
  fileName?: string;
  tokenStorageKey?: string;
}

export function FilePreviewModal({
  isOpen,
  onClose,
  fileUrl,
  fileName = "Document Preview",
  tokenStorageKey = "token",
}: FilePreviewModalProps) {
  const [contentUrl, setContentUrl] = useState<string | null>(null);
  const [downloadBlobUrl, setDownloadBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    let createdBlobUrl: string | null = null;

    async function loadAuthorizedFile() {
      if (!isOpen || !fileUrl) {
        setContentUrl(null);
        setDownloadBlobUrl(null);
        setError(null);
        return;
      }

      // If it's already a Blob or Data URL (e.g. locally selected file), use direct preview
      if (fileUrl.startsWith("blob:") || fileUrl.startsWith("data:")) {
        setContentUrl(fileUrl);
        setDownloadBlobUrl(fileUrl);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const token =
          sessionStorage.getItem(tokenStorageKey) ||
          sessionStorage.getItem("accessToken") ||
          sessionStorage.getItem("authToken");

        const headers: HeadersInit = {
          Accept: "application/pdf, image/*, */*",
        };

        if (token) {
          headers["Authorization"] = token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`;
        }

        const response = await fetch(fileUrl, {
          method: "GET",
          headers,
        });

        if (!response.ok) {
          throw new Error(`Failed to load file (${response.status})`);
        }

        const isPdf =
          /\.(pdf)($|\?)/i.test(fileUrl) ||
          response.headers.get("content-type")?.includes("pdf");

        if (isPdf) {
          // Convert arrayBuffer to Base64 Data URL for guaranteed PDF preview in iframe
          const arrayBuffer = await response.arrayBuffer();
          const base64 = bufferToBase64(arrayBuffer);
          const pdfDataUrl = `data:application/pdf;base64,${base64}`;

          const rawBlob = new Blob([arrayBuffer], { type: "application/pdf" });
          createdBlobUrl = URL.createObjectURL(rawBlob);

          setContentUrl(pdfDataUrl);
          setDownloadBlobUrl(createdBlobUrl);
        } else {
          // Image or general file - Blob Object URL
          const blob = await response.blob();
          createdBlobUrl = URL.createObjectURL(blob);

          setContentUrl(createdBlobUrl);
          setDownloadBlobUrl(createdBlobUrl);
        }
      } catch (err: any) {
        console.error("Error loading file:", err);
        setError(err.message || "Failed to load document");
      } finally {
        setIsLoading(false);
      }
    }

    loadAuthorizedFile();

    return () => {
      if (createdBlobUrl) {
        URL.revokeObjectURL(createdBlobUrl);
      }
    };
  }, [isOpen, fileUrl, tokenStorageKey]);

  if (!isOpen || !fileUrl) return null;

  const isImage = /\.(jpg|jpeg|png|webp|svg|gif)($|\?)/i.test(fileUrl);
  const isPdf =
    /\.(pdf)($|\?)/i.test(fileUrl) ||
    contentUrl?.startsWith("data:application/pdf");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="relative flex flex-col w-full h-[92vh] max-w-5xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between border-b border-border/80 px-5 py-3.5 bg-muted/40 shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden pr-2">
            {isImage ? (
              <ImageIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            ) : (
              <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            )}
            <h3 className="text-sm font-bold text-foreground truncate max-w-md">
              {fileName}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {downloadBlobUrl && (
              <>
                <a
                  href={downloadBlobUrl}
                  download={fileName}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </a>

                <a
                  href={downloadBlobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Open New Tab</span>
                </a>
              </>
            )}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Preview Viewer Canvas */}
        <div className="flex-1 bg-slate-900/90 dark:bg-slate-950/90 p-2 sm:p-4 overflow-auto flex items-center justify-center relative">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 text-white">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
              <p className="text-xs font-medium text-slate-300">
                Loading secure document...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-2 text-rose-400 p-4 text-center">
              <p className="text-sm font-bold">Failed to load preview</p>
              <p className="text-xs text-slate-400 max-w-sm">{error}</p>
            </div>
          ) : contentUrl ? (
            isPdf ? (
              <iframe
                src={contentUrl}
                title={fileName}
                className="w-full h-full rounded-lg border-0 bg-white"
              />
            ) : isImage ? (
              <img
                src={contentUrl}
                alt={fileName}
                className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
              />
            ) : (
              <iframe
                src={contentUrl}
                title={fileName}
                className="w-full h-full rounded-lg border-0 bg-white"
              />
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Helper function to convert ArrayBuffer to Base64 in modern browser environments */
function bufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}