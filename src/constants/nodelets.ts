import {
  NodeletCategory,
  NodeletInputType,
  NodeletOutputType,
} from "@/type/nodelet";
import { ConfigurationType } from "@/node/cfg/cfg-type";

export enum InternalNodelets {
  UserInput = "UserInput",
  KnowledgeBase = "KnowledgeBase",
  OpenAI = "OpenAI",
  Ollama = "Ollama",
  ChatResponse = "ChatResponse",
}

export const Nodelets = [
  {
    id: "UserInput",
    category: NodeletCategory.Input,
    name: "User Input",
    internal: true,
    image:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAAAXNSR0IArs4c6QAADE9JREFUeF7tnWt6GzcMRZWVNV1ZmpUlWVmaSTSxLEsacECQF+Dxn/ariRnw4B5zJD/66cIHBCCQlsCntJ3TOAQgcEFgQgCBxAQQOPHwaB0CCEwGIJCYAAInHh6tQwCByQAEEhNA4MTDo3UIIDAZgEBiAgiceHi0DgEEJgMQSEwAgRMPj9YhgMBkAAKJCSBw4uHROgQQmAxAIDEBBE48PFqHAAKTAQgkJoDAiYdH6xBAYDIAgcQEEDjx8GgdAghMBiCQmAACJx4erUMAgckABBITQODEw6N1CCAwGYBAYgIInHh4tA4BBCYDEEhMAIETD4/WIYDAZAACiQkgcOLh0ToEEJgMQCAxAQROPDxahwACkwEIJCaAwImHR+sQQGAyAIHEBBA48fBoHQIITAYUCHx+0cR3hQZVe0Bg1cnU7WuX9ct1i6/kvaWwifzj+h+2f0fsy+WCwHVFUdnZrbBWWa2971L/Zy2otg6Bq01UZz+brNsp21vaZztcUmYE1gl8lU6203B/PJ61p6+/brzEqYzAsyJW777bSftNbFvlRUZgscQlbGf0o3Irok3i7aPkiYzArXFg/S0Bhcdl60RKnsYIbB0/624JqJ+6r6b1b6VvQSEwYrYSUHyt27qHMqcxAreOfu31mR6ZjyZVQmIEPhozn98JVJJ331N6iREYQS0EKspbQmIEtsR37TWV5U0vMQKvLefR7leQd2eQ8t1pBD6K8LqfX0netBIj8LqCvtr5ivJuPLZfiNhO4jQfCJxmVMMaXVXeHXAqiRF4mBcpbrS6vOkepRE4hVdDmkTeN8xpTmEEHuKG/E1U5L3/Mzmj/hjAowGleFcageXdCm9wprybsPuv+736G1ebyPsvUIQDubmBvB/yDY6c1oL3miHvLu3ZP0q39fzPoD/VI/+jlgi8oLXXLc+Qt6cQo/qXdkS6uXXdCt/5qPCP+NbM9md8Il8rS78WRuBwV+RuUEneHW7knqTfkUZgOb9CG4oM+qPGez4yH4GJ3JvsKYzAR7Go8/nIgM+Wd79/1OM0AtfxIOVOVpB3H8zPgAnJPkZzAgdMW+ySo+Xdtj/y0fked9R+JV2RbEpMgMztRIXZwmSmxBGP0pKP0QhsiWLONTPl3YnNkjjiL2cicE4PUnatIO9siXu/FpZ8HcwJnNLPl00ryTtT4t6P0QhczxW5HSnKO0viiMdouQNPriE5JfI0pCzvDIkjBJZ7HYzAeQR91WkGeWdI3Pt1MALX8EVqF5nkHS1x79fBCCwV/fzNZJR3pMQInD/jZXeQWd5REiNw2fjn3lgFeUdIjMC5c16y+0ryRkvMm1glFci7qYryRkrcW2C579rINZTXrfDOR8u7/7XIL+E7e7tBz5+djuAl54tcQwPDkulWEWF8tf9bkWbe2zOj3n3zo5SeaSxc2zuIRygfnYIKPRz1ff/53o/PPZ8OWvfydD0ncDeUIRdSEkeplyPYEb0i8BF1Pv+OQEQIrY/Nz9Yp9vSo196n73YPuZ/C2priBNb8qqEsinJv2zSj+pN0RbIpTaeGdRUVwGcbOPNoqNxjxOkr+QYWJ/AwJ803UhbjfhOKvfb+yat9z2e+yJmH7lnICeyh17dWUYijHSr1HNmLrCeyjR0lp9jnI8P3CFXPE0Wh98geZB+feYTW+CoQGb5oeffrz9xD9L17frHrnjhO4O5Imy4YHb77ZiLDOGMv2/6if9RT2hHp5ppUyLd4RuC3e0Z+jN5T5F62a0d+wevSOwJ3wdh8kdFBHxnE0Xtrht9QIO+HfIMNsLMsHR3wkfLOek0cMfsZ3Jr3gcDNyFwFK8hbQeIU8vIutMvF5uKV5M0useTPPT9KHCdws4enClaUN6vEaU5fTuBTLjYXrSxvRolTHWqpmm1WZ34B8r7NYDSLM9NP8+i8bw6Bz4zZVjM6sBke/UYzsU3qz6oM/D7sB4FbRmxfOzqomcI3mo1lapn4vdsPAlvG27ZmdEAzhm80o1cTzMjv734QuE3Oo9Wjg5k5fKNZPZpdZn6/94PAR0raPz86kOnD9wvtaGa306zAD4Htfr5cOTqIJcJ3JTqaXdo3rB4lkBPYb/DoAFaSd6MPP0cGEdgBj/D54MHPzY9HaAdCTg4HPOT1wdurOYHPcUTec9z2Kvj5+P2tRuB2kISvndltBfx8/N5VI3AbTMLXxut+Nfx8/D5UI7AdKOGzs3q0En4+fg+rEdgGlfDZOD1bBT8fv6fVCHwMlvAdM3q1An4+fi+rEfg1XMLnCx/8fPwOqxH4OSLCdxiflwvg5+Nnqkbgx5gInyk+TxfBz8fPXI3AH1ERPnN8Hi6En49fUzUCv8dF+Jri82Ex/Hz8mqsR+A0Z4WuOz7sC+Pn4napG4D/YCN+p+Pwtgp+P3+lqBEbe0+G5FiKvl6CjfnWBCZ8jPDy5+OD1qF5ZYOT1JQh+Pn5dqlcVmPD54gM/H79u1SsKTPh88YGfj1/X6tUEJny++MDPx6979UoCEz5ffODn4xdSvYrAhM8XH/j5+IVVryAw4fPFB34+fqHV1QUmfL74wM/HL7y6ssCEzxcf+Pn4DamuKjDh88UHfj5+w6orCkz4fPGBn4/f0OpqAhM+X3zg5+M3vLqSwITPFx/4+fhNqa4iMOHzxQd+Pn7TqisITPh88YGfj9/U6uwCEz5ffODn4ze9OrPAhM8XH/j5+ElUZxWY8PniAz8fP5nqjAITPl984OfjJ1WdTWDC54sP/Hz85KozCUz4fPGBn4+fZHUWgQmfLz7w8/GTrc4gMOHzxQd+Pn7S1eoCEz5ffODn4ydfrSww4fPFB34+fimqVQUmfL74wM/HL021osCEzxcf+Pn4papWE5jw+eIDPx+/dNVKAhM+X3zg5+OXslpFYMLniw/8fPzSVisITPh88YGfj1/qagWBfw4k+PXXvbbAV/lA3iqTPLmP2QKPDCDyngzJtawaPx8NkeqZAiPv+RCMZLd1ibznZxVauYLA1cKHvKFK5Lr4TIG/XS6Xz8G4kNcHuBo/Hw3B6pkCR795VS18nLyCAs1uqarAyOtLVjV+PhrC1RUFrhY+Tl5hgWa3Vk1g5PUlqho/H40E1ZUErhY+Tt4EAs1usZLAM/fSe47I25to0evNDH3vd6Fn7qVnPJC3J83i15oZegT+GC7kLS5c7+0hcG+i56+HvOfZLVuJwBqjR16NOaTrAoHnjwx5588gbQcIPHd0yDuXf/q7I/C8ESLvPPZl7ozAc0aJvHO4l7srAo8fKfKOZ172jgg8drTIO5Z3+bsh8LgRI+841svcCYHHjBp5x3Be7i4IHD9y5I1nvOwdEDh29Mgby3f5qyNwXASQN44tV74SQOCYKCBvDFeuekcAgftHAnn7M+WKTwggcN9oIG9fnlztgAAC94sI8vZjyZWMBBDYCOpgGfL24chVGgkgcCOwB8uR18+QK5wkgMAnwV3LkNfHj2onAQQ+DxB5z7OjshMBBD4HEnnPcaOqMwEEbgeKvO3MqAgiUEngIERTL1vtfxczFWbFmyOw7lSRV3c2Mp0hsMwo3jWCvJpzkesKgeVGckFevZnIdoTAWqNBXq15yHeDwDojQl6dWaTpBIE1RoW8GnNI1wUCzx8Z8s6fQdoOEHju6JB3Lv/0d0fgeSNE3nnsy9wZgeeMEnnncC9315kCf7tcLp/LET3eEPIeM2KFkcBMgUf/UoARSegy5A3Fu97FZwq8nb7bKbzKB/KuMumB+5wp8LbNVR6jkXdgqFe61WyBVziFkXclowbvdbbA23YrvxZG3sGBXu12CgJXlRh5V7Npwn5VBN63XuE0/n65/P6VwO2ffEAglICawPtpvP3zn0TfJ95k/XGVFnFDI8vFbwkoCsyEIAABIwEENoJiGQQUCSCw4lToCQJGAghsBMUyCCgSQGDFqdATBIwEENgIimUQUCSAwIpToScIGAkgsBEUyyCgSACBFadCTxAwEkBgIyiWQUCRAAIrToWeIGAkgMBGUCyDgCIBBFacCj1BwEgAgY2gWAYBRQIIrDgVeoKAkQACG0GxDAKKBBBYcSr0BAEjAQQ2gmIZBBQJILDiVOgJAkYCCGwExTIIKBJAYMWp0BMEjAQQ2AiKZRBQJIDAilOhJwgYCSCwERTLIKBIAIEVp0JPEDASQGAjKJZBQJEAAitOhZ4gYCSAwEZQLIOAIgEEVpwKPUHASACBjaBYBgFFAv8DImJhDyUltqgAAAAASUVORK5CYII=",
    // config: {
    //   definition: [{ fieldName: "string", label: "string", type: "STRING" }],
    // },
    inputs: [],
    outputs: [
      {
        id: "query",
        name: "query",
        type: NodeletOutputType.String,
      },
    ],
    attrDefinitions: [
      {
        name: "23",
        fieldName: "string",
        label: "string",
        type: "STRING",
        placeholder: "string",
      },
      {
        name: "233",
        fieldName: "string1",
        label: "stringd",
        type: "VALUE_CHOOSER",
        placeholder: "string",
        model: {
          values: [
            { value: "jack", label: "Jack" },
            { value: "lucy", label: "Lucy" },
            { value: "Yiminghe", label: "yiminghe" },
          ],
        },
      },
    ],
  },
  {
    id: "KnowledgeBase",
    category: NodeletCategory.Processor,
    name: "Knowledge Base",
    internal: true,
    image:
      "data:image/png;base64,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",
    // config: {
    //   definition: [{ fieldName: "string", label: "string", type: "STRING" }],
    // },
    inputs: [
      {
        id: "query",
        name: "query",
        type: NodeletOutputType.String,
      },
    ],
    outputs: [
      {
        id: "RelativeContent",
        name: "relative content",
        type: NodeletOutputType.Context,
      },
    ],
    attrDefinitions: [
      {
        name: "Knowledge Base",
        fieldName: "knowledgeBase",
        label: "string",
        isDisplayed: true,
        displayPath: "name",
        type: ConfigurationType.KNOWLEDGE_BASE,
        placeholder: "choose knowledge base",
      },
    ],
  },
  {
    id: "OpenAI",
    category: NodeletCategory.Processor,
    name: "OpenAI",
    internal: true,
    image:
      "data:image/png;base64,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",
    // id: "openai",
    // category: "PROCESSOR",
    subCategory: "LLM",
    inputs: [
      {
        id: "query",
        name: "query",
        // fieldName: "string",
        label: "string",
        type: NodeletInputType.String,
      },
      {
        id: "context",
        name: "context",
        // fieldName: "string",
        label: "Context",
        type: NodeletInputType.Context,
      },
    ],
    outputs: [
      {
        id: "answer",
        name: "answer",
        type: NodeletOutputType.String,
      },
    ],
    attrDefinitions: [
      {
        name: "systemPrompt",
        fieldName: "systemPrompt",
        label: "System Prompt",
        type: "TEXT_AREA",
        placeholder: "System Prompt",
        // model: {
        //   values: [
        //     { value: "gpt-3.5", label: "gpt-3.5" },
        //     { value: "gpt-4", label: "gpt-4" },
        //     // { value: "Yiminghe", label: "yiminghe" },
        //   ],
        // },
      },

      {
        name: "model",
        fieldName: "model",
        label: "Model:",
        type: "VALUE_CHOOSER",
        placeholder: "openai model",
        isDisplayed: true,
        model: {
          values: [
            { value: "gpt-3.5-turbo", label: "gpt-3.5-turbo" },
            { value: "gpt-4-turbo", label: "gpt-4-turbo" },
            // { value: "Yiminghe", label: "yiminghe" },
          ],
        },
      },
      {
        name: "temperature",
        fieldName: "temperature",
        label: "Temperature:",
        type: "VALUE_CHOOSER",
        placeholder: "Temperature",
        // required: true,
        model: {
          values: [
            { value: "0.1", label: "0.1" },
            { value: "0.2", label: "0.2" },
            { value: "0.3", label: "0.3" },
            { value: "0.4", label: "0.4" },
            { value: "0.5", label: "0.5" },
            { value: "0.6", label: "0.6" },
            { value: "0.7", label: "0.7" },
            { value: "0.8", label: "0.8" },
            { value: "0.9", label: "0.9" },
            { value: "1", label: "1" },

            // { value: "Yiminghe", label: "yiminghe" },
          ],
        },
      },
      {
        name: "contextCount",
        fieldName: "contextCount",
        label: "Context Count:",
        type: "VALUE_CHOOSER",
        placeholder: "Context Count",
        // required: true,
        model: {
          values: [
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
            { value: "5", label: "5" },
            { value: "6", label: "6" },
            { value: "7", label: "7" },
            { value: "8", label: "8" },
            { value: "9", label: "9" },
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "30", label: "30" },
            { value: "50", label: "50" },
            { value: "100", label: "100" },

            // { value: "Yiminghe", label: "yiminghe" },
          ],
        },
      },
    ],
  },
  {
    id: "Ollama",
    category: NodeletCategory.Processor,
    name: "Ollama",
    internal: true,
    image:
      "data:image/png;base64,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",
    // id: "openai",
    // category: "PROCESSOR",
    subCategory: "LLM",
    inputs: [
      {
        id: "query",
        name: "query",
        // fieldName: "string",
        label: "string",
        type: NodeletInputType.String,
      },
      {
        id: "context",
        name: "context",
        // fieldName: "string",
        label: "Context",
        type: NodeletInputType.Context,
      },
    ],
    outputs: [
      {
        id: "answer",
        name: "answer",
        type: NodeletOutputType.String,
      },
    ],
    attrDefinitions: [
      {
        name: "systemPrompt",
        fieldName: "systemPrompt",
        label: "System Prompt",
        type: "TEXT_AREA",
        placeholder: "System Prompt",
        // model: {
        //   values: [
        //     { value: "gpt-3.5", label: "gpt-3.5" },
        //     { value: "gpt-4", label: "gpt-4" },
        //     // { value: "Yiminghe", label: "yiminghe" },
        //   ],
        // },
      },

      {
        name: "model",
        fieldName: "model",
        label: "Model:",
        type: "VALUE_CHOOSER",
        placeholder: "openai model",
        model: {
          values: [
            { value: "gpt-3.5-turbo", label: "gpt-3.5-turbo" },
            { value: "gpt-4-turbo", label: "gpt-4-turbo" },
            // { value: "Yiminghe", label: "yiminghe" },
          ],
        },
      },
      {
        name: "temperature",
        fieldName: "temperature",
        label: "Temperature:",
        type: "VALUE_CHOOSER",
        placeholder: "Temperature",
        // required: true,
        model: {
          values: [
            { value: "0.1", label: "0.1" },
            { value: "0.2", label: "0.2" },
            { value: "0.3", label: "0.3" },
            { value: "0.4", label: "0.4" },
            { value: "0.5", label: "0.5" },
            { value: "0.6", label: "0.6" },
            { value: "0.7", label: "0.7" },
            { value: "0.8", label: "0.8" },
            { value: "0.9", label: "0.9" },
            { value: "1", label: "1" },

            // { value: "Yiminghe", label: "yiminghe" },
          ],
        },
      },
      {
        name: "contextCount",
        fieldName: "contextCount",
        label: "Context Count",
        type: "VALUE_CHOOSER",
        placeholder: "Context Count",
        // required: true,
        model: {
          values: [
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
            { value: "5", label: "5" },
            { value: "6", label: "6" },
            { value: "7", label: "7" },
            { value: "8", label: "8" },
            { value: "9", label: "9" },
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "30", label: "30" },
            { value: "50", label: "50" },
            { value: "100", label: "100" },

            // { value: "Yiminghe", label: "yiminghe" },
          ],
        },
      },
    ],
  },
  {
    id: "ChatResponse",
    category: NodeletCategory.Output,
    name: "Chat Response",
    internal: true,
    image:
      "data:image/png;base64,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",
    // config: {
    //   definition: [{ fieldName: "string", label: "string", type: "STRING" }],
    // },
    inputs: [
      {
        id: "output",
        name: "output",
        type: NodeletOutputType.String,
      },
    ],
    outputs: [],
    attrDefinitions: [],
  },
];
