import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { PlusCircle } from "lucide-react";
import { useCallback, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";

import "reactflow/dist/style.css";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

function FlowEdit() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  // useEffect(() => {
  //   setTimeout(() => {
  //     window.ipcRenderer.runNodeCode("这是传给Node.js的参数");
  //   }, 1000);
  // }, []);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-row justify-between mx-10 my-2">
        <div>Hello world-1</div>
        <Button
          size="sm"
          className="h-7 gap-1"
          // onClick={() => navigate("/workflow-edit")}
        >
          <IconDeviceFloppy className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Save
          </span>
        </Button>
      </div>
      <Separator className=" " />
      <div className="flex flex-1">
        <aside className="w-28 py-4">sdads</aside>
        <Separator orientation="vertical" className="ml-6" />
        <div className="relative flex flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            className="absolute bottom-0 left-0 top-0 right-0"
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default FlowEdit;
