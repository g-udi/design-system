import { Separator } from "../../../../src/components/core/Separator/parts/separator.jsx";

const items = [
  { label: "Pro plan · monthly", value: "$49.00" },
  { label: "Extra seats × 2", value: "$18.00" },
  { label: "Discount", value: "−$5.00", tone: "text-ui-success-ink" },
];

export function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-3 text-sm">
      <div className="flex flex-col gap-1">
        <p className="leading-none font-medium">Order summary</p>
        <p className="text-xs text-ui-muted-foreground">
          Billed on the 1st of every month.
        </p>
      </div>
      <Separator />
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={item.label} className="flex flex-col gap-2">
            {index > 0 && <Separator className="opacity-60" />}
            <dl className="flex items-center justify-between">
              <dt className="text-ui-muted-foreground">{item.label}</dt>
              <dd className={`tabular-nums ${item.tone || ""}`}>
                {item.value}
              </dd>
            </dl>
          </div>
        ))}
      </div>
      <Separator />
      <dl className="flex items-center justify-between font-medium">
        <dt>Total</dt>
        <dd className="tabular-nums">$62.00</dd>
      </dl>
    </div>
  );
}
