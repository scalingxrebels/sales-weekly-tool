import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function InsightsFeed() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Insights Feed</h1>
            <p className="text-muted-foreground">
              Monthly insights and learnings
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Insight
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Insights</CardTitle>
            <CardDescription>Your monthly learnings and patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No insights yet. Click "New Insight" to create your first one.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

