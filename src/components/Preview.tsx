import { forwardRef } from "react";
import { WORK_ITEMS } from "../data/work";

export const Preview = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div className="preview" ref={ref}>
      {WORK_ITEMS.filter((item) => item.previewLabel).map((item) => {
        const variantClass =
          item.previewVariant && item.previewVariant !== "default" ? ` ${item.previewVariant}` : "";
        return (
          <div key={item.key} className={`pv ph${variantClass}`} data-key={item.key}>
            {item.previewLabel}
          </div>
        );
      })}
    </div>
  );
});
Preview.displayName = "Preview";
