import ReactDOM from "react-dom";
import React from "react";
import gameStyles from "./game.module.css";

interface TileProps {
  value: string | number;
}

export default function Tile({ value}: TileProps) {
  let colorClass = value
    ? value === "1"
      ? gameStyles.p1Circle
      : gameStyles.p2Circle
    : gameStyles.circle;
  return (
    <div className={gameStyles.tile}>
      {value && <div className={colorClass}>{value}</div>}
      <div className={gameStyles.circle}>{value}</div>
    </div>
  );
}
