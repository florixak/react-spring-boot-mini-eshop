import { createCategory, fetchCategories } from "@/lib/api";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { Category } from "@/types";
import type { Response } from "@/types/responses";
import { Input } from "../ui/input";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";

type CategorySelectProps = {
  watchCategoryId: number;
  setValue: (name: "categoryId", value: number) => void;
  isSubmitting: boolean;
};

const NEW_CATEGORY_VALUE = -1;

const CategorySelect = ({
  watchCategoryId,
  setValue,
  isSubmitting,
}: CategorySelectProps) => {
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  const {
    data: { data: categories } = { data: [] },
    isLoading,
    isError,
  } = useQuery<Response<Category[]>>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => createCategory(newCategoryName),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setNewCategoryName("");
      console.log(data);
      setValue("categoryId", data.data.id);
    },
  });

  return (
    <div className="flex items-end gap-4">
      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          value={watchCategoryId != null ? watchCategoryId.toString() : ""}
          disabled={isLoading || isError || isSubmitting || isPending}
          defaultValue={
            watchCategoryId != null ? watchCategoryId.toString() : ""
          }
          onValueChange={(value) =>
            setValue(
              "categoryId",
              typeof value === "string" ? parseInt(value, 10) : value
            )
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.title}
              </SelectItem>
            ))}
            <SelectItem value={NEW_CATEGORY_VALUE.toString()}>
              + Add New Category
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {watchCategoryId === NEW_CATEGORY_VALUE && (
        <div className="flex items-center gap-2 mt-2">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name"
            className="w-48"
            autoFocus
            disabled={isSubmitting}
            id="new-category"
          />
          <Button
            type="button"
            onClick={() => mutate()}
            disabled={
              !newCategoryName.trim() || isSubmitting || isLoading || isPending
            }
          >
            Add
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
