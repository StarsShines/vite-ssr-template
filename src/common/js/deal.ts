// @ts-nocheck
import { toBase64 } from 'js-base64';

export default {
  isAndroid() {
    return this.testUA('Android') || this.testUA('Adr');
  },
  isNewIphone() {
    return window && this.testUA('iPhone') && window.screen.height >= 812 && window.devicePixelRatio >= 2;
  },
  isWeiXin() {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      return true;
    } else {
      return false;
    }
  },
  onAppReady(callBack) {
    if (window && window.App) {
      typeof callBack === 'function' && callBack();
    } else {
      window.addEventListener('AppReady', callBack);
    }
  },
};
