import React from "react";
import { useDrag } from "react-dnd";

type Props = {};
export const ItemTypes = {
  KNIGHT: "knight",
};
export default function Nodelet({ nodelet }: Props) {
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: ItemTypes.KNIGHT,
      item: { text: "12" },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    }),
    []
  );
  return (
    <div
      key={nodelet.id}
      ref={dragRef}
      style={{ opacity }}
      className="h-12 flex-row  flex items-center px-3 border-b hover:bg-gray-200 cursor-pointer select-none"
    >
      <img src={nodelet.image} className="w-6 h-6" />
      <div className="font-medium pl-3">{nodelet.name}</div>
    </div>
  );
}
