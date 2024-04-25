import React from "react";

type Props = {};

export default function Nodelet({ nodelet }: Props) {
  const onDragStart = (event, nodeId) => {
    event.dataTransfer.setData("application/reactflow", nodeId);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <div
      key={nodelet.id}
      onDragStart={(event) => onDragStart(event, nodelet.id)}
      draggable
      className="h-12 flex-row  flex items-center px-3 border-b hover:bg-gray-200 cursor-pointer select-none"
    >
      <img src={nodelet.image} className="w-6 h-6" />
      <div className="font-medium pl-3 text-ellipsis overflow-x-hidden">
        {nodelet.name}
      </div>
    </div>
  );
}
