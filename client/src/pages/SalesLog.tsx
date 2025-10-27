import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function SalesLog() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sales Log</h1>
            <p className="text-muted-foreground">
              Track observations, causes, and actions
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Log Entry
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Log Entries</CardTitle>
            <CardDescription>Your sales observations and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No log entries yet. Click "New Log Entry" to create your first one.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

