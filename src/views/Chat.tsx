import {
  Button,
  Flex,
  Input,
  List,
  Paper,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { IconUserCircle } from "@tabler/icons-react";
import React, { useState } from "react";

type Props = { messages: string[]; onSendMessage: (message: string) => void };

export default function Chat({ messages, onSendMessage }: Props) {
  const [query, setQuery] = useState("");
  console.log(messages);
  return (
    <Flex
      className=" flex-1  overflow-y-hidden p-5"
      gap="md"
      direction="column"
      justify="center"
    >
      <List
        spacing="lg"
        size="sm"
        className="flex-1 overflow-y-auto "
        classNames={{ item: "text-left", itemWrapper: "items-start" }}
        icon={
          <ThemeIcon color="teal" size={24} radius="xl">
            <IconUserCircle style={{ width: rem(16), height: rem(16) }} />
          </ThemeIcon>
        }
      >
        {messages.map((message, index) => (
          <List.Item key={message + index} style={{ textAlignment: "left" }}>
            <Paper>{message} </Paper>
          </List.Item>
        ))}
      </List>
      <Input value={query} onChange={(e) => setQuery(e.target.value)} />
      <Button
        onClick={() => {
          onSendMessage(query);
          setQuery("");
        }}
        w="6rem"
      >
        Send
      </Button>
    </Flex>
  );
}
// import React, { useState, useEffect, useRef } from "react";
// import {
//   TextInput,
//   Button,
//   Container,
//   Paper,
//   Text,
//   Stack,
//   Flex,
// } from "@mantine/core";

// function ChatComponent() {
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState("");
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = () => {
//     if (inputValue.trim() !== "") {
//       setMessages([...messages, inputValue]);
//       setInputValue("");
//     }
//   };

//   const handleKeyPress = (event) => {
//     if (event.key === "Enter") {
//       sendMessage();
//     }
//   };

//   return (
//     <Flex direction={"column"} className="flex-1">
//       <Paper
//         shadow="xs"
//         padding="md"
//         style={{ height: 400, overflowY: "auto", backgroundColor: "#f4f4f4" }}
//       >
//         <Stack spacing="sm">
//           {messages.map((message, index) => (
//             <Text
//               key={index}
//               style={{
//                 padding: "10px",
//                 borderRadius: "8px",
//                 backgroundColor: "#e0e0e0",
//                 alignSelf: "flex-end",
//                 maxWidth: "70%",
//               }}
//             >
//               {message}
//             </Text>
//           ))}
//           <div ref={messagesEndRef} />
//         </Stack>
//       </Paper>
//       <TextInput
//         placeholder="Type your message here..."
//         value={inputValue}
//         onChange={(event) => setInputValue(event.currentTarget.value)}
//         onKeyPress={handleKeyPress}
//         rightSection={
//           <Button
//             onClick={sendMessage}
//             color="blue"
//             style={{ marginRight: -12 }}
//           >
//             Send
//           </Button>
//         }
//         style={{ marginTop: 10 }}
//       />
//     </Flex>
//   );
// }

// export default ChatComponent;
