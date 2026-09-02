
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeliveryHistory } from "@/services/riderDashboardService";


const STATUS_STYLES: Record<string, string> = {
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
  assigned: "bg-orange-400",
  accepted: "bg-orange-400",
  picked_up: "bg-blue-500",
  on_the_way: "bg-blue-500",
};

 export  default function DeliveryCard({ delivery }: { delivery: DeliveryHistory }) {
  const dateStr = delivery.deliveredAt
    ? new Date(delivery.deliveredAt).toLocaleDateString("en-BD", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : new Date(delivery.assignedAt).toLocaleDateString("en-BD", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">
              {delivery.order.provider.restaurantName}
            </CardTitle>
            <p className="text-xs text-gray-500 mt-0.5">
              Order #{delivery.order.orderNumber}
            </p>
          </div>
          <Badge className={STATUS_STYLES[delivery.status] ?? "bg-gray-400"}>
            {delivery.status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="flex justify-between text-sm text-gray-600">
          <span>📍 {delivery.order.deliveryArea}</span>
          <span>{dateStr}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t mt-2">
          <span className="text-sm text-gray-500">
            Order total: ৳{delivery.order.totalAmount}
          </span>
          <span className="text-sm font-semibold text-green-600">
            +৳{delivery.earnings}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}