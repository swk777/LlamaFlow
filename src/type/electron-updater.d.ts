interface VersionInfo {
  update: boolean;
  version: string;
  newVersion?: string;
}

interface ErrorType {
  message: string;
  error: Error;
}

type TSFixMe = any;
type IFuncNoop = () => void;
type IFuncVoid<T> = (input: T) => void;
type IFunc<T1, T2> = (input: T1) => T2;
