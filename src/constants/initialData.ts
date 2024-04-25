import { IWorkflowStatus } from "@/type/workflow";
import { Nodelets } from "./nodelets";
import { KnowledgeBases } from "./knowledge-base";

export const DefaultData = {
  knowledgeBases: KnowledgeBases,
  conversations: {},
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
              attr: { category: "INPUT", config: { type: "UserInput" } },
            },
          },
          {
            id: "1.5",
            position: { x: 20, y: 100 },
            data: {
              nodeletId: "knowledgeBase",
              label: "Knowledge Base",
              attr: { knowledgeBaseId: "2222" },
            },
          },
          {
            id: "2",
            position: { x: 20, y: 200 },
            data: {
              nodeletId: "openai",
              label: "OpenAI",
              attr: {
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
              attr: {},
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
              attr: { category: "INPUT", config: { type: "UserInput" } },
            },
          },
          {
            id: "1.5",
            position: { x: 20, y: 100 },
            data: {
              nodeletId: "knowledgeBase",
              label: "Knowledge Base",
              attr: { knowledgeBaseId: "2222" },
            },
          },
          {
            id: "2",
            position: { x: 20, y: 200 },
            data: {
              nodeletId: "ollama",
              label: "Ollama",
              attr: {
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
              attr: {},
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
// export const InternalNodeLets = [
//   {
//     id: "input",
//     category: "INPUT",
//     inputs: [],
//     outputs: [
//       {
//         id: "output",
//         type: "STRING",
//       },
//     ],
//     attrDefinitions: [
//       {
//         name: "233",
//         fieldName: "string1",
//         label: "stringd",
//         type: "VALUE_CHOOSER",
//         placeholder: "string",
//         model: {
//           values: [
//             { value: "jack", label: "Jack" },
//             { value: "lucy", label: "Lucy" },
//             { value: "Yiminghe", label: "yiminghe" },
//           ],
//         },
//       },
//       {
//         name: "23",
//         fieldName: "string",
//         label: "string",
//         type: "STRING",
//         placeholder: "string",
//         required: true,
//         model: {
//           disabledOnMap: {
//             string1: "jack",
//           },
//         },
//       },
//     ],
//   },
//   {
//     id: "openai",
//     category: "PROCESSOR",
//     subCategory: "LLM",
//     inputs: [
//       {
//         id: "i1",
//         name: "i1",
//         // fieldName: "string",
//         label: "string",
//         type: "STRING",
//       },
//       {
//         id: "i2",
//         name: "i2",
//         // fieldName: "string",
//         label: "string",
//         type: "STRING",
//       },
//     ],
//     outputs: [
//       {
//         id: "o1",
//         type: "STRING",
//       },
//       {
//         id: "o2",
//         type: "STRING",
//       },
//     ],
//     attrDefinitions: [
//       {
//         name: "openai1",
//         fieldName: "temp",
//         label: "string",
//         type: "STRING",
//         placeholder: "string",
//       },
//       {
//         name: "model",
//         fieldName: "model",
//         label: "model",
//         type: "VALUE_CHOOSER",
//         placeholder: "openai model",
//         model: {
//           values: [
//             { value: "gpt-3.5", label: "gpt-3.5" },
//             { value: "gpt-4", label: "gpt-4" },
//             // { value: "Yiminghe", label: "yiminghe" },
//           ],
//         },
//       },
//     ],
//   },
// ];
