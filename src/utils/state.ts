/* eslint-disable no-throw-literal */
import { produce, enableES5, setUseProxies, setAutoFreeze } from "immer";
import { isIE } from "./browser";

if (isIE()) {
  // 虽然针对IE使用了GoogleChrome/proxy-polyfill，但immer使用了polyfill不支持的traps，故IE时不使用immer的Proxy实现
  setUseProxies(false);
  enableES5();
}

setAutoFreeze(false);

const noop = (draft: any) => {}; // eslint-disable-line
// const isES6Map = o => o instanceof Map
// const isES6Set = o => o instanceof Set

const checkState = (state) => {
  if (!state || typeof state !== "object") {
    throw "immer works on vanilla object";
  }
};

const checkFunc = (f) => {
  if (typeof f !== "function") {
    throw "immer expects a function here";
  }
};

const getNewState = (oldState = {}, updater = noop) => {
  checkState(oldState);
  checkFunc(updater);
  return produce(oldState, updater);
};

const getStateUpdater = (updater = noop) => {
  // 默认不修改state
  checkFunc(updater);
  return produce(updater); // return a curried function that will be handled by setState in forms of prevState => nextState
};

export { getNewState, getStateUpdater };
