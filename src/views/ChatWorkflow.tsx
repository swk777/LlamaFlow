import { AppContext } from "@/context/AppContext";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Chat from "./Chat";
import { Flex } from "@mantine/core";
import { IWorkflow } from "@/type/workflow";
import { v4 as uuidv4 } from "uuid";
import { IConversation } from "@/type/conversation";

type Props = {
  workflow?: IWorkflow;
  conversation?: IConversation;
};

export default function ChatWorkflow({ workflow, conversation }: Props) {
  const { refreshConversations } = useContext(AppContext);
  const messages = useMemo(() => {
    return conversation?.globalContext?.messages ?? [];
  }, [conversation]);
  console.log(workflow);
  const id = conversation?.sessionId ?? `temp-${workflow?.id}-${uuidv4()}`;
  useEffect(() => {
    window.ipcRenderer.getConversationById(id).then((res) => {
      refreshConversations();
    });
  }, []);
  return (
    <Flex className="flex-1 overflow-x-hidden" direction="column">
      <Chat
        messages={messages}
        onSendMessage={(query) => {
          window.ipcRenderer
            .chat(id, workflow?.id, query, workflow)
            .then((res) => {
              console.log(res);
              refreshConversations();
              // setMessages(res);
            });
        }}
      />
    </Flex>
  );
}
