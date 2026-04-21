import { FieldStatus } from "../types";

const statusStyles: Record<FieldStatus, string> = {
  Active: "bg-green-100 text-success",
  "At Risk": "bg-red-100 text-danger",
  Completed: "bg-blue-100 text-info",
};

export function StatusBadge({ status }: { status: FieldStatus }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}>{status}</span>;
}
