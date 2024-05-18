import { EditorBtns } from "@/lib/constants";
import React from "react";

type Props = {};

const TwoColumnsPlaceholder = (props: Props) => {
  const handleStartDrag = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };
  return (
    <div
      draggable
      onDragStart={(e) => handleStartDrag(e, "2Col")}
      className="h-14 w-14 bg-muted/70 rounded-lg p-2 flex flex-row gap-[4px]"
    >
      <div className="w-full border-dashed border-[1px] border-muted-foreground/50 bg-muted rounded-lg"></div>
      <div className="w-full border-dashed border-[1px] border-muted-foreground/50 bg-muted rounded-lg"></div>
    </div>
  );
};

export default TwoColumnsPlaceholder;
