import UAParser from "ua-parser-js";

export enum AppUAIdentifier {
  DINGTALK = "DingTalk",
  WXWORK = "wxwork",
  FEI_SHU = "Lark",
  YUNZHIJIA = "Qing",
}

// 集中处理浏览器user-agent的相关逻辑
export function getUAString(): string {
  // if (process.env.BROWSER) {
  //     return window.navigator.userAgent
  // }
  return "";
}

export function isMobileDevice(uaString: string = ""): boolean {
  const ua = uaString || getUAString();
  return (
    ua &&
    /(mobile|nokia|iphone|ipod|ipad|android|samsung|htc|blackberry)/gi.test(ua)
  );
}

export function isIOSDevice(uaString: string = ""): boolean {
  const ua = uaString || getUAString();
  return ua && /(iphone|ipod|ipad)/gi.test(ua);
}

export function isAndroidDevice(uaString: string = ""): boolean {
  return isMobileDevice(uaString) && !isIOSDevice(uaString);
}

export function isUAMatchIdentifiers(
  ua: string,
  identifiers: string[]
): boolean {
  return ua && new RegExp(`(${identifiers.join("|")})`, "ig").test(ua);
}

export function isDingTalk(ua: string): boolean {
  return isUAMatchIdentifiers(ua, [AppUAIdentifier.DINGTALK]);
}
export function isYUNZHIJIA(ua: string): boolean {
  return isUAMatchIdentifiers(ua, [AppUAIdentifier.YUNZHIJIA]);
}

export const isFeiShu = (userAgent: string) =>
  isUAMatchIdentifiers(userAgent, [AppUAIdentifier.FEI_SHU]);

// see https://stackoverflow.com/questions/6262584/how-to-determine-if-the-client-is-a-touch-device/15481500#15481500
export function isTouchDevice() {
  const el = document.createElement("div");
  el.setAttribute("ongesturestart", "return;"); // or try "ontouchstart"
  // @ts-ignore
  return typeof el.ongesturestart === "function"; // @todo revise me.
}

/**
 * 是否是mobile UA 支配下的浏览器环境， 对于观远的逻辑来说，有两种 1.真机mobile环境 2. 调试时chrome会改UA来支持mobile环境（strict模式会剔除）
 * @param strict 是否采用严格模式
 */
export function isMobileUA(strict: boolean = true): boolean {
  if (!process.env.BROWSER || !navigator || !navigator.userAgent) return false; //eslint-disable-line
  if (strict && !isTouchDevice()) return false; // chrome debugger会改ua，在严格模式下 我们认为这不是一个mobile UA
  const browser = new UAParser(navigator.userAgent); //eslint-disable-line
  return (
    browser.getDevice().type === "mobile" || isMobileDevice(navigator.userAgent)
  );
}

export function getUAParser(uaString: string = "") {
  return new UAParser(uaString);
}

export function isSafari() {
  const { name } = new UAParser(navigator.userAgent).getBrowser();
  return name === "Safari";
}

export function isMacOS() {
  const ua = getUAParser(getUAString());
  const { name = "" } = ua.getOS();
  return name.match(/mac/i);
}

export function isNeedUaAutoLogin(ua) {
  return isUAMatchIdentifiers(ua, [
    AppUAIdentifier.DINGTALK,
    AppUAIdentifier.WXWORK,
    AppUAIdentifier.FEI_SHU,
  ]);
}

export function getIOSVersion() {
  const ua = getUAString();
  const isAppleDevice = /AppleWebKit/.test(ua);
  if (!isAppleDevice) return null;
  const appleVersion = ua.match(/Version\/(\d*\.\d*)/);
  if (appleVersion) {
    const version = Number(appleVersion[1]);
    return !isNaN(version) && version;
  }
  return null;
}
