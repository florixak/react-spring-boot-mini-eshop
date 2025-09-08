import { CHECKOUT_STEPS } from "@/constants";
import { CheckCircle } from "lucide-react";

type CheckoutStepsProps = {
  currentStep: number;
};

const CheckoutSteps = ({ currentStep }: CheckoutStepsProps) => {
  return (
    <div className="flex items-center justify-evenly max-w-xl mx-auto">
      {CHECKOUT_STEPS.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step.number
                ? "bg-primary border-primary text-white"
                : "border-secondary-100 text-secondary-600"
            }`}
          >
            {currentStep > step.number ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <step.icon className="h-5 w-5" />
            )}
          </div>
          <div className="ml-3 hidden sm:block">
            <p
              className={`text-sm font-medium ${
                currentStep >= step.number ? "text-primary" : "text-gray-400"
              }`}
            >
              {step.title}
            </p>
          </div>
          {index < CHECKOUT_STEPS.length - 1 && (
            <div
              className={`hidden sm:block w-72 h-0.5 ml-4 ${
                currentStep > step.number ? "bg-primary" : "bg-secondary-100"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckoutSteps;
