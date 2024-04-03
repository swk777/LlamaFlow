import {
  getUAParser,
  getUAString,
  isMobileDevice,
  isIOSDevice,
} from "./userAgent";

const BROWSER_TYPES = {
  IE: "IE",
  EDGE: "EDGE",
  FIREFOX: "FIREFOX",
  CHROME: "CHROME",
  SAFARI: "SAFARI",
  UNKNOWN: "UNKNOWN",
};
export default BROWSER_TYPES;

export function getBrowserInfo(checkMobile = false) {
  const emptyBrowserInfo = {
    // eslint-disable-line
    name: BROWSER_TYPES.UNKNOWN,
    version: 0,
  };
  // if (!process.env.BROWSER || !navigator || !navigator.userAgent)
  if (!navigator || !navigator.userAgent) return emptyBrowserInfo; //eslint-disable-line

  const uaString = getUAString();
  const uaIns = getUAParser(uaString);
  const browserInfo = uaIns.getBrowser();
  const browserName = browserInfo.name || "";
  const standard = !!browserName; // 是否是符合标准的UA，否则则可能是用户自定义的case
  let browserVersion = 0;
  let name = "";

  if (browserName) {
    if (browserName.indexOf("IE") === 0) {
      name = BROWSER_TYPES.IE;
    } else if (browserName.indexOf("Edge") === 0) {
      name = BROWSER_TYPES.EDGE;
    } else if (browserName.indexOf("Chrome") === 0) {
      name = BROWSER_TYPES.CHROME;
    } else if (browserName.indexOf("Firefox") === 0) {
      name = BROWSER_TYPES.FIREFOX;
    } else if (browserName.indexOf("Safari") === 0) {
      name = BROWSER_TYPES.SAFARI;
    }
  } else {
    if (isMobileDevice(uaString)) {
      // eslint-disable-line
      browserVersion = 75;
      name = isIOSDevice(uaString)
        ? BROWSER_TYPES.SAFARI
        : BROWSER_TYPES.CHROME;
    }
  }

  if (!name && checkMobile) {
    if (browserName.indexOf("Mobile Safari") === 0) {
      name = BROWSER_TYPES.SAFARI;
    }
    if (browserName.indexOf("WebKit") === 0) {
      name = BROWSER_TYPES.SAFARI; // use a hack way to support dingTalk browser
    }
  }

  browserVersion = browserVersion || parseInt(browserInfo.version || 0, 10);
  return { name, version: browserVersion, standard };
}

export function isBrowserVersionOk(userAgent) {
  // This method is for PC!!
  let isPass = true;
  const uaIns = getUAParser(userAgent);
  const browserInfo = uaIns.getBrowser();

  const browserName = browserInfo.name || "";
  const browserVersion = parseInt(browserInfo.version || 0, 10);

  if (browserName.indexOf("IE") === 0) {
    if (browserName.indexOf("IEMobile") === -1) {
      isPass = browserVersion >= 11;
    }
  }

  if (browserName.indexOf("Edge") === 0) {
    isPass = browserVersion >= 14;
  }

  if (browserName.indexOf("Chrome") === 0) {
    if (browserName.indexOf("Chrome WebView") === -1) {
      isPass = browserVersion >= 47;
    }
  }

  if (browserName.indexOf("Firefox") === 0) {
    isPass = browserVersion >= 47;
  }

  return isPass;
}

export function isIE() {
  const { name } = getBrowserInfo(true);
  return name === BROWSER_TYPES.IE;
}

export function isEdge() {
  const { name } = getBrowserInfo(true);
  return name === BROWSER_TYPES.EDGE;
}

export function isFirefox() {
  const { name } = getBrowserInfo(true);
  return name === BROWSER_TYPES.FIREFOX;
}
