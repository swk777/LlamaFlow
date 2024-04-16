import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDrag, DndProvider, useDrop } from "react-dnd";
import Configuration from "@/node/cfg/Configuration";
import { IconBrandHipchat, IconDeviceFloppy } from "@tabler/icons-react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useOnSelectionChange,
} from "reactflow";

import "reactflow/dist/style.css";
import Nodelet, { ItemTypes } from "./Nodelet";
import InternalNode from "@/node/custom/InternalNode";
import { AppContext } from "@/context/AppContext";
// import { Workflow } from "@/type/workflow";
import { useParams } from "react-router-dom";
import { Drawer, Flex } from "@mantine/core";
import ChatWorkflow from "./ChatWorkflow";

function FlowEdit() {
  let { workflowId = "" } = useParams();
  const [configOpened, setConfigOpened] = useState(false);
  const [chatOpened, setChatOpened] = useState(false);
  // const [selectedNodes, setSelectedNodes] = useState([]);
  const { nodelets, workflows, updateWorkflow } = useContext(AppContext);
  const workflow = workflows.find((w) => w.id === workflowId);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    workflow?.data?.nodes || []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    workflow?.data?.edges || []
  );
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
  const nodeTypes = { internalNodelet: InternalNode };
  const onSelectionChange = useCallback((data) => {
    console.log(data.nodes.length, configOpened);
    if (data.nodes.length && !configOpened) {
      setConfigOpened(true);
    } else {
      setConfigOpened(false);
    }
  }, []);
  const selectedNode = useMemo(
    () => nodes.findLast((node) => node.selected),
    [nodes]
  );
  console.log(selectedNode);
  const selectedNodelet = useMemo(
    () =>
      nodelets.find((nodelet) => nodelet.id === selectedNode?.data.nodeletId),
    [nodes]
  );
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-row justify-between mx-10 my-2">
        <div>Hello world-1</div>
        <Flex direction={"row"} gap="md">
          <Button
            size="sm"
            className="h-7 gap-1"
            onClick={() => {
              updateWorkflow &&
                updateWorkflow(workflowId, {
                  ...workflow,
                  data: { nodes, edges },
                });
            }}
          >
            <IconDeviceFloppy className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Save
            </span>
          </Button>
          <Button
            size="sm"
            className="h-7 gap-1"
            onClick={() => {
              setChatOpened(true);
            }}
          >
            <IconBrandHipchat className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Chat
            </span>
          </Button>
        </Flex>
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
            nodes={nodes.map((node) => {
              const nodelet = nodelets.find(
                (nodelet) => nodelet.id === node.data.nodeletId
              );
              return {
                ...node,
                type: nodelet?.internal ? "internalNodelet" : "",
              };
            })}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            className="absolute bottom-0 left-0 top-0 right-0"
            nodeTypes={nodeTypes}
            onSelectionChange={onSelectionChange}
            onPaneClick={() => {
              setConfigOpened(false);
            }}
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
        {/* <div
          style={{
            // height: "100%",
            // width: "90%",
            // margin: "0 auto",
            minWidth: 300,
            display: "none",
          }}
          className="absolute bottom-0 top-0 right-0 bg-white p-4  border-t"
        > */}
        <Drawer
          opened={chatOpened}
          onClose={() => {
            setChatOpened(false);
          }}
          title="Chat"
          position="right"
          withOverlay={false}
          size="sm"
          styles={{
            inner: { right: 0, margin: "0.8rem" },
          }}
          // scrollAreaComponent={ScrollArea.Autosize}
        >
          <ChatWorkflow />
        </Drawer>
        <Drawer
          opened={configOpened}
          onClose={() => {
            setConfigOpened(false);
          }}
          title="Configuration"
          position="right"
          withOverlay={false}
          size="sm"
          styles={{
            inner: { right: 0, margin: "0.8rem" },
          }}
          // scrollAreaComponent={ScrollArea.Autosize}
        >
          <Configuration
            key={1}
            definitions={selectedNodelet?.attrDefinitions || []}
            config={selectedNode?.data.attr || {}}
            style={{ padding: "20px 0" }}
            onChange={(config) => {
              const selectedNodeIndex = nodes.findIndex(
                (node) => node.id === selectedNode?.id
              );
              setNodes([
                ...nodes.slice(0, selectedNodeIndex),
                {
                  ...selectedNode,
                  data: { ...selectedNode.data, attr: config },
                },
                ...nodes.slice(selectedNodeIndex + 1),
              ]);
            }}
            // getCustomCFGClass={getTargetCFGClass}
          />
        </Drawer>
        {/* </div> */}
      </div>
    </div>
  );
}

export default FlowEdit;
