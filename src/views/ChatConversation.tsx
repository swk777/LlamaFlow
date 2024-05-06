import { AppContext } from "@/context/AppContext";
import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import ChatWorkflow from "./ChatWorkflow";
import WorkflowGrid from "./WorkflowGrid";

type Props = {};

export default function ChatConversation({}: Props) {
  const { conversationId } = useParams();
  const { conversations, workflows } = useContext(AppContext);
  if (conversationId === "new") {
    return <WorkflowGrid />;
  }
  const conversation = conversations.find(
    (c) => c.sessionId === conversationId
  );
  const workflow = workflows.find((w) => w.id === conversation?.workflowId);
  return <ChatWorkflow workflow={workflow} conversation={conversation} />;
}
