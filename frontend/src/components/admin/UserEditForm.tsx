import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import useUsers from "@/hooks/useUsers";
import { adminUserEditSchema, type AdminUserEditFormData } from "@/lib/schema";
import { updateUserAdmin } from "@/lib/api";
import { Label } from "../ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Edit } from "lucide-react";

type Props = {
  userId: number;
};

const UserEditForm = ({ userId }: Props) => {
  const { user, isLoading, error, refetch } = useUsers({ userId });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminUserEditFormData>({
    resolver: zodResolver(adminUserEditSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "user",
      verified: false,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.toLowerCase() as "user" | "admin",
        verified: !!user.verified,
      });
    }
  }, [user, reset]);

  const onSubmit = async (values: AdminUserEditFormData) => {
    try {
      await updateUserAdmin(userId, values);
      toast.success("User updated!");
      refetch();
    } catch (err) {
      toast.error((err as Error)?.message || "Failed to update user.");
    }
  };

  if (isLoading) return <div className="py-8 text-center">Loading…</div>;
  if (error)
    return (
      <div className="py-8 text-center text-red-500">Failed to load user.</div>
    );
  if (!user)
    return <div className="py-8 text-center text-red-500">User not found.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="mb-4">
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <Edit className="h-5 w-5" /> Edit User
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="block mb-1 font-medium" htmlFor="firstName">
                First Name
              </Label>
              <Input {...register("firstName")} id="firstName" />
              {errors.firstName && (
                <p className="text-xs text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <Label className="block mb-1 font-medium" htmlFor="lastName">
                Last Name
              </Label>
              <Input {...register("lastName")} id="lastName" />
              {errors.lastName && (
                <p className="text-xs text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <Label className="block mb-1 font-medium" htmlFor="email">
                Email
              </Label>
              <Input {...register("email")} type="email" id="email" />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label className="block mb-1 font-medium" htmlFor="role">
                Role
              </Label>
              <select
                {...register("role")}
                id="role"
                className="w-full border rounded px-2 py-1"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="text-xs text-red-500">{errors.role.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("verified")}
                id="verified"
                className="h-4 w-4"
              />
              <Label htmlFor="verified" className="font-medium">
                Verified
              </Label>
              <Badge
                className={user.verified ? "bg-green-600" : "bg-yellow-400"}
              >
                {user.verified ? "Verified" : "Not verified"}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default UserEditForm;
