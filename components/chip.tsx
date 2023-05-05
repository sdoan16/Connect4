import { FC } from "react";
import { useDrag } from "react-dnd";
import gameStyles from "./game.module.css";
import { ChipTypes } from "../pages/";

export interface ChipProps {
  id: string;
  type: string;
  handleDrop: (j: number) => void;
}
interface DropResult {
  col: number;
}

export const Chip: FC<ChipProps> = function Chip({ id, type, handleDrop }) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type,
      item: { id },
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult<DropResult>();
        if (item && dropResult) {
          return handleDrop(dropResult.col);
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, type]
  );
  return (
    <div
      ref={drag}
      style={{ position: "unset", opacity: isDragging ? 0.4 : 1 }}
      className={
        type === ChipTypes.YELLOW ? gameStyles.p1Circle : gameStyles.p2Circle
      }
    ></div>
  );
};
