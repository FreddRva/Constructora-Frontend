"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, Loader2 } from "lucide-react";

interface FileUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
}

export function FileUpload({
  label,
  value,
  onChange,
  accept = "image/*,.pdf",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatusMsg("");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al subir el archivo");

      onChange(data.url);
      setStatusMsg("Archivo cargado correctamente");
    } catch (err) {
      setStatusMsg(err instanceof Error ? err.message : "Error al subir archivo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-700">{label}</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Seleccione un archivo o pegue un enlace..."
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
        />

        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-900 transition-colors hover:bg-amber-100">
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
          ) : (
            <UploadCloud className="h-4 w-4 text-amber-600" />
          )}
          {uploading ? "Subiendo..." : "Subir Archivo"}
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
      {statusMsg && (
        <p className="flex items-center gap-1 text-xs text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {statusMsg}
        </p>
      )}
    </div>
  );
}
