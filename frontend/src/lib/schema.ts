import { z } from "zod";

export const checkoutSchema = z.object({
  // Shipping fields
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(5, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  shippingMethod: z.enum(["STANDARD", "EXPRESS", "OVERNIGHT"], {
    required_error: "Shipping method is required",
  }),
  // Payment fields
  cardNumber: z.string().min(16, "Card number must be 16 digits"),
  expiryDate: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, "Invalid expiry date format (MM/YY)"),
  cvv: z.string().min(3, "CVV must be 3 digits"),
  cardholderName: z.string().min(1, "Cardholder name is required"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const shippingSchema = checkoutSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  address: true,
  city: true,
  state: true,
  postalCode: true,
  country: true,
  shippingMethod: true,
});

export const paymentSchema = checkoutSchema.pick({
  cardNumber: true,
  expiryDate: true,
  cvv: true,
  cardholderName: true,
});

export type ShippingFormData = z.infer<typeof shippingSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
