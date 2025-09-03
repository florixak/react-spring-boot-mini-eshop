import type { View } from "@/types";
import { Button } from "./ui/button";
import { Grid3X3, List } from "lucide-react";

type ViewModeProps = {
  viewMode: View;
  onViewChange: (view: View) => void;
};

const ViewMode = ({ viewMode, onViewChange }: ViewModeProps) => {
  return (
    <div className="flex border rounded-md">
      <Button
        variant={viewMode === "grid" ? "default" : "ghost"}
        size="sm"
        className={`rounded-r-none ${
          viewMode === "grid" ? "bg-amber-900 text-white" : "text-amber-900"
        }`}
        onClick={() => onViewChange("grid")}
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="sm"
        className={`rounded-l-none ${
          viewMode === "list" ? "bg-amber-900 text-white" : "text-amber-900"
        }`}
        onClick={() => onViewChange("list")}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ViewMode;
