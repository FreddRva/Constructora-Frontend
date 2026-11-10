import { InventoryForm } from "./InventoryForm";
import { InventoryList } from "./InventoryList";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Inventario de Materiales y Herramientas
        </h1>
        <p className="text-sm text-slate-600">
          Control de stock en almacén central, materiales consumibles y estado de maquinaria.
        </p>
      </div>

      <InventoryForm />
      <InventoryList />
    </div>
  );
}
