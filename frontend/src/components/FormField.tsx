import type { useForm, Path } from "react-hook-form";
import { Input } from "./ui/input";

import type { FieldValues } from "react-hook-form";
import { Label } from "./ui/label";

const FormField = <T extends FieldValues>({
  label,
  id,
  register,
  error,
  type = "text",
  isSubmitting,
  className,
}: {
  label: string;
  id: Path<T>;
  register: ReturnType<typeof useForm<T>>["register"];
  error?: string;
  type?: React.HTMLInputTypeAttribute | undefined;
  isSubmitting: boolean;
  className?: string;
}) => (
  <div className={className}>
    <Label
      htmlFor={String(id)}
      className="block text-sm font-medium text-secondary-200"
    >
      {label} *
    </Label>
    <Input
      {...register(id)}
      name={String(id)}
      className={error ? "border-red-500" : ""}
      type={type}
      disabled={isSubmitting}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default FormField;
