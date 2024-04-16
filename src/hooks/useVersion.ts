import { useCallback, useState } from "react";

declare namespace GD {
  type IValue = string | boolean;
  type IFuncValueChange = (value: IValue, event: any) => void;

  type IFuncNoop = () => void;
  type IFuncVoid<T> = (p: T) => void;
  type IFunc<T, K> = (p: T) => K;

  interface IMDItem {
    value: string | number;
    label?: string;
    icon?: string;
  }
}

export default function useVersion(): [number, GD.IFuncNoop] {
  const [version, setVersion] = useState(0);
  const upgrade = useCallback(
    () => setVersion(Math.random() * 100),
    [setVersion]
  );
  return [version, upgrade];
}
