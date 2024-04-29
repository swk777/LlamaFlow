import { AppContext } from "@/context/AppContext";
import { checkIntegration } from "@/utils/utils";
import { Avatar, Button, LoadingOverlay, Text } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

type Props = {};

export default function Nodelet({ nodelet }: Props) {
  const { hovered, ref } = useHover();
  const { integrations } = useContext(AppContext);
  const navigate = useNavigate();
  const needIntegration =
    nodelet?.integration && checkIntegration(nodelet, integrations);
  const onDragStart = (event, nodeId) => {
    event.dataTransfer.setData("application/reactflow", nodeId);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <div
      key={nodelet.id}
      onDragStart={(event) => onDragStart(event, nodelet.id)}
      draggable={!needIntegration}
      ref={ref}
      className="h-12 px-2 flex-row max-w-52 flex items-center border-b hover:bg-gray-100 cursor-pointer relative"
    >
      <Avatar color="blue" radius="sm">
        <img src={nodelet.image} className="w-6 h-6" />
      </Avatar>
      <div className="text-sm pl-2 truncate overflow-x-hidden font-semibold">
        {nodelet.name}
      </div>
      {needIntegration && (
        <LoadingOverlay
          visible={hovered}
          loaderProps={{
            children: (
              <Button
                variant="default"
                className="border-none"
                onClick={() => {
                  navigate(`/integration/${nodelet.id}`);
                }}
              >
                <Text className="text-primary font-bold">Go To Settings</Text>
              </Button>
            ),
          }}
          overlayProps={{ blur: 4 }}
        />
      )}
    </div>
  );
}
