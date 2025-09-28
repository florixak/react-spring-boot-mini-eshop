import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { formatPrice } from "@/lib/utils";

type RevenueStatsProps = {
  totalRevenue: number;
};

const RevenueStats = ({ totalRevenue }: RevenueStatsProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-start py-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold text-primary">
            Total Revenue
          </span>
        </div>
        <div className="text-3xl font-bold text-primary">
          {formatPrice(totalRevenue)}
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueStats;
