import { Card, CardContent, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";

type AuthCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
};

const AuthCard = ({
  title,
  description,
  children,
  className,
}: AuthCardProps) => {
  return (
    <Card
      className={`w-full max-w-md mt-6 p-6 border-secondary-100 rounded-md font-playfair`}
    >
      <CardHeader className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-primary font-playfair">
          {title}
        </h2>
        <p className="text-secondary-200">{description}</p>
      </CardHeader>
      <Separator orientation="horizontal" className="bg-secondary-100" />
      <CardContent className={`p-0 ${className}`}>{children}</CardContent>
    </Card>
  );
};

export default AuthCard;
