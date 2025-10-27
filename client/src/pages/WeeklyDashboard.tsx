import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function WeeklyDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Weekly Dashboard</h1>
            <p className="text-muted-foreground">
              Track weekly sales metrics and pipeline health
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Dashboard
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pipeline Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">817.6 k€</div>
              <p className="text-xs text-muted-foreground">Current week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">20/19</div>
              <p className="text-xs text-muted-foreground">This week / Last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.9/17.4 k€</div>
              <p className="text-xs text-muted-foreground">This week / Last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">Yellow</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Dashboards</CardTitle>
            <CardDescription>Your weekly sales dashboards</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No dashboards yet. Click "New Dashboard" to create your first one.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

