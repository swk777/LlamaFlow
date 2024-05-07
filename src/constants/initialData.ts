import { IWorkflowStatus } from "@/type/workflow";
import { Nodelets } from "./nodelets";
import { KnowledgeBases } from "./knowledgeBase";
import { Integrations } from "./integrations";

export const DefaultData = {
  integrations: Integrations,
  knowledgeBases: KnowledgeBases,
  conversations: [],
  workflows: [
    {
      id: "1",
      name: "hello world",
      category: IWorkflowStatus.Draft,
      lastModified: "2023-07-12 10:42 AM",
      data: {
        nodes: [
          {
            id: "1",
            position: { x: 20, y: 20 },
            data: {
              nodeletId: "input1",
              label: "Input",
              config: { category: "INPUT", config: { type: "UserInput" } },
            },
          },
          {
            id: "1.5",
            position: { x: 20, y: 100 },
            data: {
              nodeletId: "knowledgeBase",
              label: "Knowledge Base",
              config: { knowledgeBaseId: "2222" },
            },
          },
          {
            id: "2",
            position: { x: 20, y: 200 },
            data: {
              nodeletId: "openai",
              label: "OpenAI",
              config: {
                category: "PROCESSOR",
                subCategory: "LLM",
                config: { type: "OpenAI", model: "gpt-4-turbo-preview" },
              },
            },
          },
          {
            id: "3",
            position: { x: 20, y: 300 },
            data: {
              nodeletId: "ChatOutput",
              label: "ChatBot",
              config: {},
            },
          },
        ],
        edges: [
          {
            id: "e1-2",
            source: "1",
            target: "2",
            sourceHandle: "output",
            targetHandle: "i1",
          },
          {
            id: "e1-1.5",
            source: "1",
            target: "1.5",
            sourceHandle: "output",
            targetHandle: "k1",
          },
          {
            id: "e1.5-2",
            source: "1.5",
            target: "2",
            sourceHandle: "context",
            targetHandle: "i2",
          },
          {
            id: "e2-c",
            source: "2",
            target: "3",
            sourceHandle: "o1",
            targetHandle: "input",
          },
        ],
      },
    },
    {
      id: "2",
      name: "hello world",
      category: IWorkflowStatus.Draft,
      lastModified: "2023-07-12 10:42 AM",
      data: {
        nodes: [
          {
            id: "1",
            position: { x: 20, y: 20 },
            data: {
              nodeletId: "input1",
              label: "Input",
              config: { category: "INPUT", config: { type: "UserInput" } },
            },
          },
          {
            id: "1.5",
            position: { x: 20, y: 100 },
            data: {
              nodeletId: "knowledgeBase",
              label: "Knowledge Base",
              config: { knowledgeBaseId: "2222" },
            },
          },
          {
            id: "2",
            position: { x: 20, y: 200 },
            data: {
              nodeletId: "ollama",
              label: "Ollama",
              config: {
                category: "PROCESSOR",
                subCategory: "LLM",
                config: { type: "OpenAI", model: "gpt-4-turbo-preview" },
              },
            },
          },
          {
            id: "3",
            position: { x: 20, y: 300 },
            data: {
              nodeletId: "ChatOutput",
              label: "ChatBot",
              config: {},
            },
          },
        ],
        edges: [
          {
            id: "e1-2",
            source: "1",
            target: "2",
            sourceHandle: "output",
            targetHandle: "i1",
          },
          {
            id: "e1-1.5",
            source: "1",
            target: "1.5",
            sourceHandle: "output",
            targetHandle: "k1",
          },
          {
            id: "e1.5-2",
            source: "1.5",
            target: "2",
            sourceHandle: "context",
            targetHandle: "i2",
          },
          {
            id: "e2-c",
            source: "2",
            target: "3",
            sourceHandle: "o1",
            targetHandle: "input",
          },
        ],
      },
    },
    {
      id: "000",
      name: "hello world",
      category: IWorkflowStatus.Draft,
      lastModified: "2023-07-12 10:42 AM",
    },
    {
      id: "3",
      name: "hello world",
      category: IWorkflowStatus.Published,
      lastModified: "2023-07-12 10:42 AM",
    },
    {
      id: "4",
      name: "hello world",
      category: IWorkflowStatus.Draft,
      lastModified: "2023-07-12 10:42 AM",
    },
    {
      id: "5",
      name: "hello world",
      category: IWorkflowStatus.Draft,
      lastModified: "2023-07-12 10:42 AM",
    },
  ],
  nodelets: Nodelets,
};
