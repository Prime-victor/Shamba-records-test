import { Link } from "react-router-dom";

import { Field } from "../types";
import { StageBadge } from "./StageBadge";
import { StatusBadge } from "./StatusBadge";

export function FieldCard({ field }: { field: Field }) {
  return (
    <Link
      to={`/fields/${field.id}`}
      className="block rounded-xl border border-border bg-surface p-5 shadow-soft transition hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-ink">{field.name}</h3>
          <p className="text-sm text-muted">{field.crop_type}</p>
        </div>
        <StatusBadge status={field.status} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <StageBadge stage={field.stage} />
        <span className="text-sm text-muted">Planted {new Date(field.planting_date).toLocaleDateString()}</span>
      </div>
      <p className="mt-4 text-sm text-muted">
        {field.assigned_agent ? `Assigned to ${field.assigned_agent.name}` : "Awaiting assignment"}
      </p>
    </Link>
  );
}
