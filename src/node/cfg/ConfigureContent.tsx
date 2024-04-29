import React, { useContext } from "react";
import { getTargetCFGClass } from "./types";
import ConfigContext from "./ConfigContext";
import { Flex } from "@mantine/core";

type Props = {};

export default function ConfigureContent({ definitions, style }: Props) {
  const { isFieldVisible } = useContext(ConfigContext);

  return (
    <Flex style={style} gap="xs" direction={"column"}>
      {definitions &&
        definitions.map((def) => {
          const TargetDef = getTargetCFGClass(def);
          if (TargetDef && isFieldVisible(def)) {
            const rowStyle = { marginTop: 10 };
            return (
              <TargetDef
                key={def.name || def.label}
                definition={def}
                style={rowStyle}
              />
            );
          }
          return null;
        })}
    </Flex>
  );
}
