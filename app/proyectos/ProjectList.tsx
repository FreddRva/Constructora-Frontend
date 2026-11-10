"use client";

import { useProjects } from "@/hooks/useConstructoraQueries";
import { useConstructoraStore } from "@/store/useConstructoraStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, MapPin, Calendar, User } from "lucide-react";

export function ProjectList() {
  const { data: projects = [], isLoading, error, deleteMutation } = useProjects();
  const { setEditingProject } = useConstructoraStore();

  if (isLoading) return <p className="text-sm text-slate-500">Cargando proyectos...</p>;
  if (error)
    return (
      <Card className="border-red-200 bg-red-50 text-red-700">
        No se pudo conectar con <code>project-service</code> (puerto 8081). Asegúrate de que el backend esté en ejecución.
      </Card>
    );

  if (projects.length === 0) {
    return (
      <Card className="text-center text-sm text-slate-500">
        No hay proyectos registrados todavía. Crea el primero arriba.
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {projects.map((p) => (
        <Card key={p.id} className="flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-slate-400">ID #{p.id}</span>
                <h3 className="text-base font-bold text-slate-900">{p.name}</h3>
              </div>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                {p.status}
              </span>
            </div>

            <div className="mt-3 space-y-1.5 text-xs text-slate-600">
              <p className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <strong>Cliente:</strong> {p.client}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <strong>Ubicación:</strong> {p.location || "Sin especificar"}
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <strong>Plazo:</strong> {p.start_date || "—"} al {p.end_date || "—"}
              </p>
              {p.image_url && (
                <p className="pt-1">
                  <a
                    href={p.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 hover:underline"
                  >
                    Ver plano / imagen ↗
                  </a>
                </p>
              )}
            </div>

            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs font-medium text-slate-700">
                <span>Avance de obra</span>
                <span>{p.progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-amber-500 transition-all"
                  style={{ width: `${Math.min(100, Math.max(0, p.progress))}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
            <Button size="sm" variant="outline" onClick={() => setEditingProject(p)}>
              <Edit2 className="h-3.5 w-3.5" />
              Editar
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => deleteMutation.mutate(p.id)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Eliminar
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

