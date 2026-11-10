"use client";

import { useProcurement, useProjects } from "@/hooks/useConstructoraQueries";
import { useConstructoraStore } from "@/store/useConstructoraStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Building2, PackageCheck } from "lucide-react";

export function ProcurementList() {
  const { data: purchases = [], isLoading, error, deleteMutation } = useProcurement();
  const { data: projects = [] } = useProjects();
  const { setEditingPurchase } = useConstructoraStore();

  if (isLoading) return <p className="text-sm text-slate-500">Cargando órdenes de compra...</p>;
  if (error)
    return (
      <Card className="border-red-200 bg-red-50 text-red-700">
        No se pudo conectar con <code>procurement-service</code> (puerto 8085).
      </Card>
    );

  const getProjectName = (projectId: number) => {
    if (!projectId) return "Almacén General";
    const found = projects.find((p) => p.id === projectId);
    return found ? found.name : `Proyecto #${projectId}`;
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {purchases.map((p) => (
        <Card key={p.id} className="flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400">Orden #{p.id}</span>
                <h3 className="flex items-center gap-1.5 text-base font-bold text-slate-900">
                  <Building2 className="h-4 w-4 text-amber-600" />
                  {p.supplier_name}
                </h3>
                <p className="text-xs text-slate-500">RUC: {p.ruc}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  p.status === "Entregado"
                    ? "bg-emerald-100 text-emerald-800"
                    : p.status === "Pendiente"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {p.status}
              </span>
            </div>

            <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs">
              <p className="flex items-center gap-1.5 font-semibold text-slate-900">
                <PackageCheck className="h-4 w-4 text-slate-500" />
                {p.item_name}
              </p>
              <div className="mt-2 flex items-center justify-between text-slate-600">
                <span>
                  Cantidad: <strong>{p.quantity}</strong> × S/ {p.unit_price.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                </span>
                <span className="text-sm font-bold text-emerald-700">
                  Total: S/ {p.total_amount.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <p className="mt-1.5 text-slate-500">Destino: {getProjectName(p.project_id)}</p>
              {p.invoice_url && (
                <a
                  href={p.invoice_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block rounded bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 hover:underline"
                >
                  Ver factura / guía ↗
                </a>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
            <Button size="sm" variant="outline" onClick={() => setEditingPurchase(p)}>
              <Edit2 className="h-3.5 w-3.5" />
              Editar
            </Button>
            <Button size="sm" variant="danger" onClick={() => deleteMutation.mutate(p.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

