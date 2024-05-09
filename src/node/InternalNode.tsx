import { AppContext } from "@/context/AppContext";
import { ActionIcon, Flex, LoadingOverlay, Text } from "@mantine/core";
import React, { useContext } from "react";
import _get from "lodash/get";
import { useHover } from "@mantine/hooks";

import { Handle, Position } from "reactflow";
import { IconSettings } from "@tabler/icons-react";
import { getRandomColor } from "@/utils/utils";
type Props = { data: any };

export default function InternalNode({ data, ...others }: Props) {
  console.log(others);
  const { nodelets } = useContext(AppContext);
  const { hovered, ref } = useHover();
  const nodelet = nodelets.find((nodelet) => nodelet.id === data?.nodeletId);
  const hasConfiguration = !!(nodelet?.configDefinitions || []).length;
  const displayAttr = nodelet?.configDefinitions.find(
    (definition) => definition.isDisplayed
  );
  const displayContent =
    displayAttr &&
    _get(
      data?.config,
      `${displayAttr.fieldName}${
        displayAttr.displayPath ? "." + displayAttr.displayPath : ""
      }`
    );
  const { inputs = [], outputs = [] } = nodelet || {};
  return (
    <>
      <Flex
        className="w-24 h-20 border bg-neutral-50 shadow-md rounded-sm  relative"
        direction={"column"}
        align={"center"}
        justify={"start"}
        ref={ref}
      >
        <div
          className="w-full h-3 shrink-0"
          style={{ backgroundColor: getRandomColor(nodelet?.id ?? "") }}
        ></div>
        {/* <div
          className="absolute w-2 h-2 rounded-full top-1 right-1"
          style={{ backgroundColor: getRandomColor() }}
        ></div> */}
        <Flex
          direction={"column"}
          className="flex-1 overflow-hidden"
          align={"center"}
          justify={"center"}
          pos="relative"
        >
          <LoadingOverlay
            visible={hovered && hasConfiguration}
            loaderProps={{
              children: (
                <ActionIcon
                  variant="subtle"
                  aria-label="Settings"
                  className="border-none"
                >
                  <IconSettings className="w-8 h-8 text-primary" />
                </ActionIcon>
              ),
            }}
            overlayProps={{ blur: 4 }}
          />
          {/* {hovered ? (
            <IconSettings className="w-6 h-6 mb-1 font-semibold" />
          ) : ( */}
          <img src={nodelet?.image} className="w-6 h-6 mb-1" />
          {/* )} */}
          {displayContent && (
            <Text
              fz={13}
              px={4}
              className="max-w-24 truncate text-gray-600 hover:text-clip"
            >
              {displayContent}
            </Text>
          )}
        </Flex>
        <Text
          fz={14}
          fw={600}
          mx={4}
          className="absolute max-w-40 truncate"
          style={{ bottom: -26 }}
        >
          {nodelet?.name}
        </Text>
      </Flex>
      {inputs.map((input, index) => (
        <Handle
          key={input.id}
          id={input.id}
          type="target"
          position={Position.Left}
          style={{
            top: `calc(100% / ${inputs.length + 1} * ${index + 1})`,
            width: "10px",
            height: "10px",
            backgroundColor: "white",
            border: "1px solid #ccc",
          }}
        >
          <div
            style={{
              position: "absolute",
              transform: "translate(-114%, -38%)",
              color: "grey",
              fontSize: "12px",
            }}
          >
            {input.id}
          </div>
        </Handle>
      ))}
      {outputs.map((output, index) => (
        <Handle
          key={output.id}
          id={output.id}
          type="source"
          position={Position.Right}
          style={{
            top: `calc(100% / ${outputs.length + 1} * ${index + 1})`,
            width: "10px",
            height: "10px",
            backgroundColor: "white",
            border: "1px solid #ccc",
          }}
        >
          <div
            style={{
              position: "absolute",
              transform: "translate(12px, -38%)",
              color: "grey",
              fontSize: "12px",
            }}
          >
            {output.id}
          </div>
        </Handle>
      ))}
    </>
  );
}
