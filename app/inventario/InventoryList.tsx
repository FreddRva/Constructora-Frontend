"use client";

import { useInventory } from "@/hooks/useConstructoraQueries";
import { useConstructoraStore } from "@/store/useConstructoraStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Wrench, Boxes } from "lucide-react";

export function InventoryList() {
  const { data: items = [], isLoading, error, deleteMutation } = useInventory();
  const { inventoryCategoryFilter, setInventoryCategoryFilter, setEditingItem } =
    useConstructoraStore();

  if (isLoading) return <p className="text-sm text-slate-500">Cargando inventario...</p>;
  if (error)
    return (
      <Card className="border-red-200 bg-red-50 text-red-700">
        No se pudo conectar con <code>inventory-service</code> (puerto 8082).
      </Card>
    );

  const filtered = items.filter((item) =>
    inventoryCategoryFilter === "ALL" ? true : item.category === inventoryCategoryFilter
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {(["ALL", "MATERIAL", "HERRAMIENTA"] as const).map((cat) => (
          <Button
            key={cat}
            size="sm"
            variant={inventoryCategoryFilter === cat ? "primary" : "outline"}
            onClick={() => setInventoryCategoryFilter(cat)}
          >
            {cat === "ALL" ? "Todos" : cat === "MATERIAL" ? "Materiales" : "Herramientas"}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="text-center text-sm text-slate-500">
          No hay recursos en esta categoría.
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {filtered.map((item) => {
            const isTool = item.category === "HERRAMIENTA";
            return (
              <Card key={item.id} className="flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        isTool ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {isTool ? <Wrench className="h-3 w-3" /> : <Boxes className="h-3 w-3" />}
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      {item.project_id > 0 ? `Proyecto #${item.project_id}` : "Almacén Central"}
                    </span>
                  </div>

                  <h3 className="mt-2 text-base font-bold text-slate-900">{item.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-amber-700">
                    Stock: {item.stock} {item.unit}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Condición: {item.condition}</p>
                  {item.image_url && (
                    <a
                      href={item.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 hover:underline"
                    >
                      Ver ficha / foto ↗
                    </a>
                  )}
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                  <Button size="sm" variant="outline" onClick={() => setEditingItem(item)}>
                    <Edit2 className="h-3.5 w-3.5" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteMutation.mutate(item.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

