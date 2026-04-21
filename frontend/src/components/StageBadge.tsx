import { FieldStage } from "../types";

const stageStyles: Record<FieldStage, string> = {
  Planted: "bg-slate-100 text-slate-600",
  Growing: "bg-green-100 text-green-700",
  Ready: "bg-amber-100 text-amber-700",
  Harvested: "bg-primary/15 text-primary",
};

export function StageBadge({ stage }: { stage: FieldStage }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stageStyles[stage]}`}>{stage}</span>;
}
