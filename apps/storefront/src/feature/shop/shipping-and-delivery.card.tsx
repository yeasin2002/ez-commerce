import { Calendar, Truck } from "lucide-react";

const ShippingAndDeliveryCard = () => {
  return (
    <div className="rounded-lg border border-hairline-soft bg-cloud/50 p-4 space-y-3">
      <div className="flex items-start gap-3 text-xs text-charcoal">
        <Calendar className="h-4 w-4 text-mute mt-0.5" />
        <div>
          <span className="font-semibold">Estimated delivery time:</span> 7-21
          Days.
        </div>
      </div>
      <div className="flex items-start gap-3 text-xs text-charcoal">
        <Truck className="h-4 w-4 text-mute mt-0.5" />
        <div>
          <span className="font-semibold">Free shipping:</span> Min Order of 3+
          Items
        </div>
      </div>
    </div>
  );
};

export default ShippingAndDeliveryCard;
