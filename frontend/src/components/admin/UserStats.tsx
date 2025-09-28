import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

type UserStatsProps = {
  totalUsers: number;
  newUsers: number;
};

const UserStats = ({ totalUsers, newUsers }: UserStatsProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-start py-6">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold text-primary">Users</span>
        </div>
        <div className="text-3xl font-bold text-primary">{totalUsers}</div>
        <div className="text-sm text-secondary-200">
          {newUsers} new this week
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStats;
