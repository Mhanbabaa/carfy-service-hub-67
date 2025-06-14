
import { PartsCard } from "./PartsCard";
import { Part } from "@/types/part";

interface PartsGridProps {
  parts: Part[];
  onView: (part: Part) => void;
  onEdit: (part: Part) => void;
  onDelete: (partId: string) => void;
}

export const PartsGrid = ({ parts, onView, onEdit, onDelete }: PartsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {parts.map((part) => (
        <PartsCard
          key={part.id}
          part={part}
          onView={() => onView(part)}
          onEdit={() => onEdit(part)}
          onDelete={() => onDelete(part.id)}
        />
      ))}
    </div>
  );
};
