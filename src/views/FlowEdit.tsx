import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDrag, DndProvider, useDrop } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";

// import CFGContext from "@/node/cfg/CFGContext";
import Configuration from "@/node/cfg/Configuration";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useCallback, useContext, useEffect, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";

import "reactflow/dist/style.css";
import Nodelet, { ItemTypes } from "./Nodelet";

const initialNodes = [
  { id: "1", position: { x: 20, y: 20 }, data: { label: "1" } },
  { id: "2", position: { x: 20, y: 100 }, data: { label: "2" } },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

function FlowEdit() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodelets, setNodelets] = useState([]);
  useEffect(() => {
    window.ipcRenderer.getNodelets().then(setNodelets);
  }, []);
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.KNIGHT,
      drop: () => {
        console.log("drop");
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    })
    // [x, y]
  );
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  // const { getTargetCFGClass } = useContext(CFGContext);
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
      <div className="flex flex-1 relative">
        <aside className="w-36 py-4 flex flex-col ">
          {nodelets.map((nodelet) => (
            <Nodelet nodelet={nodelet} key={nodelet.id} />
          ))}
        </aside>
        <Separator orientation="vertical" />
        <div className="relative flex flex-1" ref={drop}>
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
        <div
          style={{
            // height: "100%",
            // width: "90%",
            // margin: "0 auto",
            minWidth: 300,
            display: "none",
          }}
          className="absolute bottom-0 top-0 right-0 bg-white p-4  border-t"
        >
          <Configuration
            key={1}
            definitions={[
              {
                label: "string",
                type: "LABEL",
                placeholder: "string",
                name: "12",
              },
              {
                name: "23",
                fieldName: "string",
                label: "string",
                type: "STRING",
                placeholder: "string",
              },
            ]}
            style={{ padding: "20px 0" }}
            // getCustomCFGClass={getTargetCFGClass}
          />
        </div>
      </div>
    </div>
  );
}

export default FlowEdit;
