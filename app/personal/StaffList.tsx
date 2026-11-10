"use client";

import { useStaff, useProjects } from "@/hooks/useConstructoraQueries";
import { useConstructoraStore } from "@/store/useConstructoraStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Phone, Briefcase, DollarSign } from "lucide-react";

export function StaffList() {
  const { data: workers = [], isLoading, error, deleteMutation } = useStaff();
  const { data: projects = [] } = useProjects();
  const { setEditingWorker } = useConstructoraStore();

  if (isLoading) return <p className="text-sm text-slate-500">Cargando personal...</p>;
  if (error)
    return (
      <Card className="border-red-200 bg-red-50 text-red-700">
        No se pudo conectar con <code>staff-service</code> (puerto 8084).
      </Card>
    );

  const getProjectName = (projectId: number) => {
    if (!projectId) return "Disponible (Oficina Central)";
    const found = projects.find((p) => p.id === projectId);
    return found ? found.name : `Proyecto #${projectId}`;
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {workers.map((w) => (
        <Card key={w.id} className="flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400">Personal #{w.id}</span>
                <h3 className="text-base font-bold text-slate-900">{w.name}</h3>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  w.status === "Activo"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {w.status}
              </span>
            </div>

            <div className="mt-3 space-y-1.5 text-xs text-slate-600">
              <p className="flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                <strong>Cargo:</strong> {w.role}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <strong>Teléfono:</strong> {w.phone || "—"}
              </p>
              <p className="flex items-center gap-2">
                <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                <strong>Jornal Diario:</strong> S/ {w.daily_wage.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
              </p>
              <p className="mt-2 rounded bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700">
                Obra: {getProjectName(w.project_id)}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
            <Button size="sm" variant="outline" onClick={() => setEditingWorker(w)}>
              <Edit2 className="h-3.5 w-3.5" />
              Editar
            </Button>
            <Button size="sm" variant="danger" onClick={() => deleteMutation.mutate(w.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

