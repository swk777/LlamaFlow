import { IKnowledgeBase } from "@/type/knowledgeBase";
import React, { useContext, useState } from "react";
import { Card, Text, SimpleGrid, Flex, FileButton } from "@mantine/core";
import classes from "./KnowledgeCard.module.css";
import { IconCloudUpload } from "@tabler/icons-react";
import { AppContext } from "@/context/AppContext";
import { useDisclosure } from "@mantine/hooks";
import { KnowledgeCard } from "./components/KnowledgeCard";
import AddKnowledgeModal from "./components/AddKnowledgeModal";

type Props = {
  knowledgeBases: IKnowledgeBase[];
};

export default function KnowledgeBaseBoard({}: Props) {
  const { knowledgeBases, refreshKnowledgeBase } = useContext(AppContext);
  const [opened, { open, close }] = useDisclosure(false);
  const [files, setFiles] = useState<File[]>([]);
  return (
    <>
      <SimpleGrid
        cols={{ base: 2, sm: 3, lg: 5 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
        className="px-8 py-8"
      >
        <FileButton
          onChange={(files) => {
            setFiles(files);
            open();
          }}
          accept=".pdf"
          multiple
        >
          {(props) => (
            <Card withBorder padding="lg" className={classes.card} {...props}>
              <Flex
                direction={"column"}
                align="center"
                justify="space-between"
                gap="xs"
                mt="md"
              >
                <IconCloudUpload className="text-primary" size="48" />
                <Text fw={600} c="grey">
                  Add Files
                </Text>
              </Flex>
            </Card>
          )}
        </FileButton>
        {knowledgeBases.map((knowledgeBase) => (
          <KnowledgeCard knowledgeBase={knowledgeBase} key={knowledgeBase.id} />
        ))}
      </SimpleGrid>
      <AddKnowledgeModal opened={opened} close={close} files={files} />
    </>
  );
}
