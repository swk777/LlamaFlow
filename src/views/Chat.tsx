import { Button, Flex, Input, List, ThemeIcon, rem } from "@mantine/core";
import { IconUserCircle } from "@tabler/icons-react";
import React, { useState } from "react";

type Props = { messages: string[]; onSendMessage: (message: string) => void };

export default function Chat({ messages, onSendMessage }: Props) {
  const [query, setQuery] = useState("");
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
        // withPadding
      >
        {messages.map((message) => (
          <List.Item style={{ textAlignment: "left" }}>{message} </List.Item>
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
