import Configuration from "@/node/config/Configuration";
import { IconBrandHipchat, IconDeviceFloppy } from "@tabler/icons-react";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

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
import Nodelet from "./Nodelet";
import InternalNode from "@/node/custom/InternalNode";
import { AppContext } from "@/context/AppContext";
import { useParams } from "react-router-dom";
import { Button, Divider, Drawer, Flex } from "@mantine/core";
import ChatWorkflow from "./ChatWorkflow";
import { getInitialWorkflow } from "@/constants/workflow";
import { buildDefaultConfig } from "@/utils/utils";

const nodeTypes = { internalNodelet: InternalNode };

function FlowEdit() {
  const { workflowId = "" } = useParams();
  const [configOpened, setConfigOpened] = useState(false);
  const [chatOpened, setChatOpened] = useState(false);
  const { nodelets, workflows, updateWorkflow } = useContext(AppContext);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const reactFlowWrapper = useRef(null);
  const workflow =
    workflows.find((w) => w.id === workflowId) ||
    getInitialWorkflow(workflowId);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    workflow?.data?.nodes || []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    workflow?.data?.edges || []
  );
  const [selectedNode, setSelectedNode] = useState();
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const nodeletId = event.dataTransfer.getData("application/reactflow");
      // // check if the dropped element is valid
      if (typeof nodeletId === "undefined" || !nodeletId) {
        return;
      }
      const nodelet = nodelets.find((n) => n.id === nodeletId);
      if (!nodelet) {
        return;
      }
      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position =
        reactFlowInstance &&
        reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
      const newNode = {
        id: uuidv4(),
        type: "node",
        position,
        data: {
          label: nodelet.id,
          nodeletId,
          config: buildDefaultConfig(nodelet),
        },
      };
      console.log(newNode);
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  console.log(nodes);
  // const selectedNode = useMemo(
  //   () => nodes.findLast((node) => node.selected),
  //   [nodes]
  // );

  const selectedNodelet = useMemo(
    () =>
      nodelets.find((nodelet) => nodelet.id === selectedNode?.data.nodeletId),
    [selectedNode]
  );

  const onSelectionChange = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);
  useEffect(() => {
    if (!configOpened && (selectedNodelet?.configDefinitions || []).length) {
      setConfigOpened(true);
    } else {
      setConfigOpened(false);
    }
  }, [selectedNode]);
  return (
    <Flex className="flex-col flex-1">
      <Flex className="flex-row justify-between mx-10 my-5 align-middle">
        <div>{workflow.name}</div>
        <Flex direction={"row"} gap="md">
          <Button
            size="sm"
            className="h-7 gap-1"
            onClick={() => {
              updateWorkflow &&
                updateWorkflow(workflowId, {
                  ...workflow,
                  data: reactFlowInstance && reactFlowInstance.toObject(),
                }).then(() => {
                  console.log("finish");
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
      </Flex>
      <Divider />
      <div className="flex flex-1 relative">
        <aside className="w-38 py-4 flex flex-col ">
          {nodelets.map((nodelet) => (
            <Nodelet nodelet={nodelet} key={nodelet.id} />
          ))}
        </aside>
        <Divider orientation="vertical" />
        <div
          className="relative flex flex-1 reactflow-wrapper"
          ref={reactFlowWrapper}
        >
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
            onNodeClick={onSelectionChange}
            onPaneClick={() => {
              setConfigOpened(false);
            }}
            onDrop={onDrop}
            onInit={setReactFlowInstance}
            onDragOver={onDragOver}
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
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
          <ChatWorkflow
            workflowId={workflowId}
            workflow={{
              ...workflow,
              data: reactFlowInstance && reactFlowInstance.toObject(),
            }}
          />
        </Drawer>
        <Drawer
          opened={configOpened}
          onClose={() => {
            setConfigOpened(false);
          }}
          title={`${selectedNodelet?.name} Configuration`}
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
            definitions={selectedNodelet?.configDefinitions || []}
            config={selectedNode?.data.config || {}}
            style={{ padding: "20px 0" }}
            onChange={(config) => {
              const selectedNodeIndex = nodes.findIndex(
                (node) => node.id === selectedNode?.id
              );
              setNodes([
                ...nodes.slice(0, selectedNodeIndex),
                {
                  ...selectedNode,
                  data: { ...selectedNode.data, config },
                },
                ...nodes.slice(selectedNodeIndex + 1),
              ]);
            }}
          />
        </Drawer>
        {/* </div> */}
      </div>
    </Flex>
  );
}

export default FlowEdit;
