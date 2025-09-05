import type { View } from "@/types";
import { Button } from "./ui/button";
import { Grid3X3, List } from "lucide-react";
import type { Route } from "@/routes";

type ViewModeProps = {
  viewMode: View;
  navigate: ReturnType<typeof Route.useNavigate>;
  search: ReturnType<typeof Route.useSearch>;
};

const ViewMode = ({ viewMode, navigate, search }: ViewModeProps) => {
  const handleViewChange = (viewValue: View) => {
    navigate({ search: { ...search, view: viewValue }, resetScroll: false });
  };
  return (
    <div className="flex border rounded-md">
      <Button
        variant={viewMode === "grid" ? "default" : "ghost"}
        size="sm"
        className={`rounded-r-none ${
          viewMode === "grid" ? "bg-amber-900 text-white" : "text-amber-900"
        }`}
        onClick={() => handleViewChange("grid")}
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="sm"
        className={`rounded-l-none ${
          viewMode === "list" ? "bg-amber-900 text-white" : "text-amber-900"
        }`}
        onClick={() => handleViewChange("list")}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ViewMode;
