import { ProjectForm } from "./ProjectForm";
import { ProjectList } from "./ProjectList";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Gestión de Proyectos y Obras</h1>
        <p className="text-sm text-slate-600">
          Registro, seguimiento de avance, plazos y documentación técnica de obras.
        </p>
      </div>

      <ProjectForm />
      <ProjectList />
    </div>
  );
}
