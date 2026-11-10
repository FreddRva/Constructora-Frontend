"use client";

import { useBudgets, useProjects } from "@/hooks/useConstructoraQueries";
import { useConstructoraStore } from "@/store/useConstructoraStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

export function BudgetList() {
  const { data: budgets = [], isLoading, error, deleteMutation } = useBudgets();
  const { data: projects = [] } = useProjects();
  const { setEditingBudget } = useConstructoraStore();

  if (isLoading) return <p className="text-sm text-slate-500">Cargando presupuestos...</p>;
  if (error)
    return (
      <Card className="border-red-200 bg-red-50 text-red-700">
        No se pudo conectar con el servicio de presupuestos.
      </Card>
    );

  if (budgets.length === 0) {
    return (
      <Card className="text-center text-sm text-slate-500">
        No hay presupuestos registrados todavía.
      </Card>
    );
  }

  const getProjectName = (projectId: number) => {
    const found = projects.find((p) => p.id === projectId);
    return found ? found.name : `Proyecto #${projectId}`;
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {budgets.map((b) => (
        <Card key={b.id} className="flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400">Presupuesto #{b.id}</span>
                <h3 className="text-base font-bold text-slate-900">
                  {getProjectName(b.project_id)}
                </h3>
                {b.notes && <p className="mt-0.5 text-xs text-slate-500">{b.notes}</p>}
              </div>
              <div className="rounded-lg bg-emerald-50 px-3 py-1.5 text-right">
                <span className="block text-[10px] font-medium uppercase text-emerald-700">
                  Costo Total (PEN)
                </span>
                <span className="inline-flex items-center text-base font-bold text-emerald-800">
                  S/ {b.total_cost.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-3 text-xs">
              <div>
                <span className="block text-slate-400">Materiales</span>
                <strong className="text-slate-800">
                  S/ {b.material_cost.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                </strong>
              </div>
              <div>
                <span className="block text-slate-400">Mano de Obra</span>
                <strong className="text-slate-800">
                  S/ {b.labor_cost.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                </strong>
              </div>
              <div>
                <span className="block text-slate-400">Equipos</span>
                <strong className="text-slate-800">
                  S/ {b.equipment_cost.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                </strong>
              </div>
            </div>
            {b.document_url && (
              <div className="mt-2">
                <a
                  href={b.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 hover:underline"
                >
                  Ver documento de sustento ↗
                </a>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
            <Button size="sm" variant="outline" onClick={() => setEditingBudget(b)}>
              <Edit2 className="h-3.5 w-3.5" />
              Editar
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => deleteMutation.mutate(b.id)}
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
