import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Edit, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormData } from "@/lib/schema";
import FormField from "../FormField";
import type { Product } from "@/types";
import CategorySelect from "./CategorySelect";
import { createProduct, fetchProduct, updateProduct } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useEffect } from "react";

type ProductFormProps = {
  productId?: Product["id"];
};

const ProductForm = ({ productId }: ProductFormProps) => {
  const { data: { data: product } = { data: null } } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!productId,
  });

  const { register, formState, watch, setValue, trigger, handleSubmit } =
    useForm({
      defaultValues: {
        title: product?.title || "",
        description: product?.description || "",
        price: product?.price || 0,
        stockQuantity: product?.stockQuantity || 0,
        categoryId: product?.category.id || undefined,
        imageUrl: product?.imageUrl || "",
      },
      resolver: zodResolver(productSchema),
    });
  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setValue("title", product.title);
      setValue("description", product.description);
      setValue("price", product.price);
      setValue("stockQuantity", product.stockQuantity);
      setValue("categoryId", product.category.id);
      setValue("imageUrl", product.imageUrl);
    }
  }, [product, setValue]);

  const watchCategoryId = watch("categoryId");

  const onSubmit = async (data: ProductFormData) => {
    try {
      const isValid = await trigger([
        "title",
        "description",
        "price",
        "stockQuantity",
        "categoryId",
        "imageUrl",
      ]);

      if (!isValid) {
        console.log("Form validation failed");
        return;
      }
      if (product) {
        toast.promise(updateProduct(product.id, { enabled: true, ...data }), {
          loading: "Updating product...",
          success: "Product updated successfully!",
          error: "Failed to update product.",
        });
      } else {
        toast.promise(createProduct(data), {
          loading: "Creating product...",
          success: "Product created successfully!",
          error: "Failed to create product.",
        });
      }
    } catch (error) {
      console.error("Failed to create product:", error);
      return;
    }

    navigate({ to: "/admin/products" });
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="mb-4">
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              {!product ? (
                <>
                  <Plus className="h-5 w-5" /> Add New Product
                </>
              ) : (
                <>
                  <Edit className="h-5 w-5" /> Edit Product
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField<ProductFormData>
              id="title"
              label="Product Title"
              register={register}
              error={formState.errors.title?.message}
              isSubmitting={formState.isSubmitting}
              placeholder="Enter product title"
              className="w-full"
            />
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                {...register("description")}
                id="description"
                name="description"
                required
                placeholder="Describe the product..."
                className="mt-1"
              />
            </div>
            <CategorySelect
              watchCategoryId={watchCategoryId}
              setValue={setValue}
              isSubmitting={formState.isSubmitting}
            />
            <FormField
              id="price"
              label="Price ($)"
              type="number"
              step={0.01}
              min={0}
              register={register}
              registerOptions={{ valueAsNumber: true }}
              error={formState.errors.price?.message}
              isSubmitting={formState.isSubmitting}
              placeholder="0.00"
              className="w-full"
            />
            <FormField
              id="stockQuantity"
              label="Stock Quantity"
              type="number"
              min={0}
              defaultValue={0}
              register={register}
              registerOptions={{ valueAsNumber: true }}
              error={formState.errors.stockQuantity?.message}
              isSubmitting={formState.isSubmitting}
              placeholder="0"
              className="w-full"
            />
            <FormField
              id="imageUrl"
              label="Image URL"
              type="url"
              register={register}
              error={formState.errors.imageUrl?.message}
              isSubmitting={formState.isSubmitting}
              placeholder="https://example.com/image.jpg"
              className="w-full"
            />
            {watch("imageUrl") ? (
              <>
                <Label className="mt-4">Image Preview:</Label>
                <img
                  src={watch("imageUrl")}
                  alt="Product Image"
                  className="min-h-[200px] max-w-[300px] object-contain border border-gray-200 rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/600x400/EEE/31343C";
                  }}
                  loading="lazy"
                />
              </>
            ) : null}
          </CardContent>
          <CardFooter className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/admin/products" })}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting
                ? "Saving..."
                : product
                ? "Save"
                : "Create"}{" "}
              Product
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ProductForm;
