import { useCallback, useState } from "react";

export default function useVersion(): [number, GD.IFuncNoop] {
  const [version, setVersion] = useState(0);
  const upgrade = useCallback(
    () => setVersion(Math.random() * 100),
    [setVersion]
  );
  return [version, upgrade];
}
