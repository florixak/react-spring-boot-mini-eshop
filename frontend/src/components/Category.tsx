import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type CategoryProps = {
  name: string;
  onClick: () => void;
  isActive?: boolean;
};

const Category = ({ name, onClick, isActive }: CategoryProps) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={cn(
        "px-6 py-3 rounded-lg border-secondary-200",
        isActive ? "bg-primary text-white" : "bg-transparent text-primary"
      )}
    >
      {name}
    </Button>
  );
};

export default Category;
