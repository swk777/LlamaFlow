import { AppContext } from "@/context/AppContext";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Chat from "./Chat";
import { Flex } from "@mantine/core";
import { IWorkflow } from "@/type/workflow";

type Props = { workflowId: string; workflow?: IWorkflow };

export default function ChatWorkflow({ workflowId, workflow }: Props) {
  // let { workflowId = "" } = useParams();
  const [messages, setMessages] = useState([]);
  // const { nodelets, workflows, updateWorkflow } = useContext(AppContext);
  // const workflow = workflows.find((w) => w.id === workflowId);
  useEffect(() => {
    window.ipcRenderer.getConversationById("11234").then((res) => {
      console.log(res);
      setMessages(res?.globalContext?.messages || []);
    });
  }, []);
  return (
    <Flex className="flex-1 overflow-x-hidden" direction="column">
      <Chat
        messages={messages}
        onSendMessage={(query) => {
          window.ipcRenderer
            .chat("11234", workflowId, query, workflow)
            .then((res) => {
              setMessages(res);
            });
        }}
      />
    </Flex>
  );
}
