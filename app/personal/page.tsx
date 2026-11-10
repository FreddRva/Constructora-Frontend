import { StaffForm } from "./StaffForm";
import { StaffList } from "./StaffList";

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Personal y Trabajadores de Obra</h1>
        <p className="text-sm text-slate-600">
          Administración de ingenieros residentes, maestros de obra, operarios y asignaciones.
        </p>
      </div>

      <StaffForm />
      <StaffList />
    </div>
  );
}
