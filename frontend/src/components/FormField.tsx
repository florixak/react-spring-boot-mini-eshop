import type { useForm, Path } from "react-hook-form";
import { Input } from "./ui/input";

import type { FieldValues } from "react-hook-form";
import { Label } from "./ui/label";

const FormField = <T extends FieldValues>({
  label,
  id,
  register,
  error,
  isSubmitting,
}: {
  label: string;
  id: Path<T>;
  register: ReturnType<typeof useForm<T>>["register"];
  error?: string;
  isSubmitting: boolean;
}) => (
  <div>
    <Label
      htmlFor={String(id)}
      className="block text-sm font-medium text-secondary-200"
    >
      {label} *
    </Label>
    <Input
      {...register(id)}
      className={error ? "border-red-500" : ""}
      disabled={isSubmitting}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default FormField;
