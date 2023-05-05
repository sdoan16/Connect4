import React from "react";
import { ArrowDownIcon } from "evergreen-ui";
import { ChipTypes } from "../pages";
import boardStyles from "../styles/board.module.css";
import { useDrop } from "react-dnd";

export interface ArrowProps {
  j: number;
  dropChip: (i: number) => void;
}

export default function DropArrow({ j, dropChip }: ArrowProps) {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: [ChipTypes.RED, ChipTypes.YELLOW],
    drop: () => ({ col: j }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
  const isActive = isOver && canDrop;
  let backgroundColor = "white";
  if (isOver) {
    backgroundColor = "#EBF0FF";
  }
  return (
    <div ref={drop} style={{ backgroundColor }} className={boardStyles.arrow}>
      <ArrowDownIcon size={30} color="disabled"></ArrowDownIcon>
    </div>
  );
}
