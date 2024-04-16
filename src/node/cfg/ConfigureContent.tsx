import React, { useContext } from "react";
import { getTargetCFGClass } from "./types";
import DefContext from "./DefContext";

type Props = {};

export default function ConfigureContent({ definitions, style }: Props) {
  const { isDefVisible } = useContext(DefContext);

  return (
    <div className={"column-flex"} style={style}>
      {definitions &&
        definitions.map((def) => {
          const TargetDef = getTargetCFGClass(def);
          if (TargetDef && isDefVisible(def)) {
            const rowStyle = { marginTop: 10 };
            // if (hasUnifyTitle(TargetDef)) {
            //   return (
            //     <div
            //       key={def.name || def.label}
            //       className="row-flex-baseline"
            //       style={rowStyle}
            //     >
            //       <TitleClass def={def} />
            //       <TargetDef definition={def} className="flex1" />
            //     </div>
            //   );
            // }
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
    </div>
  );
}
