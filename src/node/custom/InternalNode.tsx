import { AppContext } from "@/context/AppContext";
import React, { useContext } from "react";
import { Handle, Position } from "reactflow";
type Props = { data: any };
const handleStyle = { top: 10 };
export default function InternalNode({ data }: Props) {
  const { nodelets } = useContext(AppContext);
  const nodelet = nodelets.find((nodelet) => nodelet.id === data?.nodeletId);
  const { inputs = [], outputs = [] } = nodelet || {};
  console.log(nodelet?.name, outputs);
  return (
    <>
      {inputs.map((input, index) => (
        <Handle
          key={input.id}
          id={input.id}
          type="target"
          position={Position.Left}
          style={{ top: `calc(100% / ${inputs.length + 1} * ${index + 1})` }}
        />
      ))}
      <div className="w-24 h-14 border">
        <label htmlFor="text">{data.label}</label>
      </div>
      {outputs.map((output, index) => (
        <Handle
          key={output.id}
          id={output.id}
          type="source"
          position={Position.Right}
          style={{
            top: `calc(100% / ${outputs.length + 1} * ${index + 1})`,
          }}
        />
      ))}
    </>
  );
}
