// @ts-nocheck
import dayjs from 'dayjs';
import MD5 from 'crypto-js/md5';
/* NA协议 */
import deal from './deal';

export default {
  ...deal,
  getUrlParams(queryName: string) {
    const query = window.location.search.substring(1);
    const arr = query.split('&');
    for (let i = 0; i < arr.length; i++) {
      const groupArr = arr[i].split('=');
      if (groupArr[0] === queryName) {
        return groupArr[1];
      }
    }
    return '';
  },
  getLocationSearch() {
    const params = {};
    let arr = location.href.split('?');
    if (arr.length <= 1) return params;
    arr = arr[1].split('&');
    for (let i = 0, l = arr.length; i < l; i++) {
      const a = arr[i].split('=');
      params[a[0]] = a[1];
    }
    return params;
  },
  typeOf: (obj: any) => {
    const toString = Object.prototype.toString;
    const map = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
      '[object Object]': 'object',
    };
    return map[toString.call(obj)];
  },
  getTimeWeek(time: Date) {
    let week;
    switch (new Date(time).getDay()) {
      case 1:
        week = '周一';
        break;
      case 2:
        week = '周二';
        break;
      case 3:
        week = '周三';
        break;
      case 4:
        week = '周四';
        break;
      case 5:
        week = '周五';
        break;
      case 6:
        week = '周六';
        break;
      default:
        week = '周日';
    }
    return week;
  },
  getSecTimeDates(min: number, max: number) {
    const startTime = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + min);
    const endTime = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + max);
    const dates: any[] = [];
    while (endTime.getTime() - startTime.getTime() >= 0) {
      const year = startTime.getFullYear();
      const month = startTime.getMonth() < 9 ? '0' + (startTime.getMonth() + 1) : startTime.getMonth() + 1;
      const day = startTime.getDate().toString().length == 1 ? '0' + startTime.getDate() : startTime.getDate();
      dates.push({
        timeStr: `${year}${month}${day}`,
        label: `${month}月${day}日 ${this.getTimeWeek(startTime)}`,
      });
      startTime.setDate(startTime.getDate() + 1);
    }
    return dates;
  },
  //小时数组
  getHours() {
    const hours: any[] = [];
    for (let i = 0; i < 24; i++) {
      if (i < 10) {
        hours.push(`0${i}`);
      } else {
        hours.push(`${i}`);
      }
    }
    return hours;
  },
  //获取 年月日 小时 分钟 index
  getIndexStr(time: any, type: number) {
    time = new Date(time);
    const arr = this.getSecTimeDates(-7, 30);
    const hoursArr = this.getHours();
    let str = '';
    let index = 0;
    switch (type) {
      case 1:
        index = 7;
        time.getFullYear();
        // eslint-disable-next-line no-case-declarations
        const year = time.getFullYear(),
          month = time.getMonth() < 9 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1,
          day = time.getDate().toString().length == 1 ? '0' + time.getDate() : time.getDate();
        str = `${year}${month}${day}`;
        arr.forEach((item, i) => {
          if (item.timeStr === str) {
            index = i;
          }
        });
        break;
      case 2:
        str = time.getHours();
        index = hoursArr.indexOf(str + '') !== -1 ? hoursArr.indexOf(str + '') : 0;
        break;
      case 3:
        if (time.getMinutes() > 30) {
          index = 1;
        } else {
          index = 0;
        }
        break;
      default:
        console.log(1);
    }
    return index;
  },

  sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1);
      }, ms);
    });
  },
  dayOut(s: number) {
    const nowDay = dayjs();
    const m2 = dayjs(s * 1000);
    return nowDay.diff(m2, 'day');
  },
  secondToTimeStr(second) {
    if (/\d{2}(:\d{2}){1,2}/.test(second)) {
      return second;
    }
    const hours = Math.floor(second / 3600) || 0;
    const mins = Math.floor((second / 60) % 60) || 0;
    // const secs = Math.floor(second - hours * 3600 - mins * 60) || 0;
    // eslint-disable-next-line
    return ('0' + hours).slice(-2) + ':' + ('0' + mins).slice(-2);
  },
  /* 时间戳 或者 时间格式 转换 format 格式 */
  formatTime(time: number | Date, format = 'YYYY-MM-dd hh:mm:ss') {
    const dateobj = new Date(time);
    const date = {
      'M+': dateobj.getMonth() + 1,
      'd+': dateobj.getDate(),
      'h+': dateobj.getHours(),
      'm+': dateobj.getMinutes(),
      's+': dateobj.getSeconds(),
      'q+': Math.floor((dateobj.getMonth() + 3) / 3),
      'S+': dateobj.getMilliseconds(),
    };
    if (/(y+)/i.test(format)) {
      format = format.replace(RegExp.$1, `${dateobj.getFullYear()}`.substr(4 - RegExp.$1.length));
    }
    // eslint-disable-next-line
    for (let k in date) {
      if (new RegExp(`(${k})`).test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? date[k] : `00${date[k]}`.substr(`${date[k]}`.length));
      }
    }
    return format;
  },
  // '20200202'日期转换成'2020年02月02日'
  formatDate(value: string) {
    const arr = value.split('');
    arr.splice(4, 0, '年'), arr.splice(7, 0, '月');
    arr.push('日');
    return arr.join('');
  },

  // 获取昨日的日期字符串
  getYesStr() {
    let date = new Date();
    const time = date.getTime() - 86400000;
    date = new Date(time);
    return `${date.getFullYear()}${date.getMonth() >= 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)}${
      date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
    }`;
  },
  /* 时间戳转化年月日 */
  secondToDate(val) {
    const formatTimeNumber = (n) => {
      n = n.toString();
      return n[1] ? n : `0${n}`;
    };
    if (val) {
      const time = new Date(parseInt(val, 10) * 1000);
      return `${time.getFullYear()}年${formatTimeNumber(time.getMonth() + 1)}月${formatTimeNumber(time.getDate())}日`;
    }
    return '';
  },

  /** 在父字符串中匹配子字符串并返回子字符串两侧的字符串 */
  highLightText(fatherStr, childStr) {
    if (fatherStr && childStr) {
      const arr = fatherStr.split(childStr);
      if (arr.length > 1) {
        return `<span>${arr[0]}<span style="color: #F94C09">${childStr}</span>${arr.slice(1).join(childStr)}</span>`;
      }
      return fatherStr;
    }
    return fatherStr;
  },
  // 格式化列表格式为查验所需格式（两个页面使用了同一个数据源）
  formatListDataToCheckData(arr) {
    const checkList: any[] = [];
    arr.forEach((item) => {
      if (item.remedy_info && item.remedy_info.forEach) {
        item.remedy_info.forEach((itm) => {
          checkList.push({ ...itm, date: item.date });
        });
      }
    });
    return checkList;
  },
  /* 协议锚点问题 模拟 */
  goScroll(word: any) {
    let aBox: any = document.querySelectorAll(`a[name='${decodeURIComponent(word.hash.replace('#', ''))}']`);
    let total;
    if (aBox.length) {
      total = aBox[0].offsetTop;
    } else {
      aBox = document.getElementById(word.hash.replace('#', ''));
      total = aBox.offsetTop;
    }
    const container: any = document.getElementById('app'); //想要scrollTop生效必须让容器是height:100%;overflow:scroll才行。
    container.scrollTop = total;
  },
  //时间差默认距离当前时间差值
  getRemainderTime(startTime, type = 'string', endTime = Date.now()) {
    const oneDayTime = 24 * 60 * 60;
    const oneHourTime = 60 * 60;
    const onMinuteTime = 60;
    const nowTime = Math.ceil(endTime / 1000);
    const diffTime = startTime - nowTime;
    if (diffTime <= 0) {
      return '';
    }
    let result = '';
    const resultObj = {};
    const day = Math.floor(diffTime / oneDayTime);
    if (day > 0) {
      result += `${day}天`;
      resultObj['day'] = day;
    }
    const hour = Math.floor((diffTime % oneDayTime) / oneHourTime);
    if (hour > 0) {
      result += `${hour}小时`;
      resultObj['hour'] = hour;
    }
    const minute = Math.floor((diffTime % oneHourTime) / onMinuteTime);
    if (minute > 0) {
      result += `${minute}分`;
      resultObj['minute'] = minute;
    }
    const second = Math.floor(diffTime % onMinuteTime);
    if (second > 0) {
      result += `${second}秒`;
      resultObj['second'] = second;
    }
    return type === 'string' ? result : resultObj;
  },
  secondToTime(diffTime) {
    const oneDayTime = 24 * 60 * 60;
    const oneHourTime = 60 * 60;
    const onMinuteTime = 60;

    if (diffTime <= 0) {
      return '';
    }
    let result = '';
    const resultObj = {};
    const day = Math.floor(diffTime / oneDayTime);
    if (day > 0) {
      result += `${day}天`;
      resultObj['day'] = day;
    }
    const hour = Math.floor((diffTime % oneDayTime) / oneHourTime);
    if (hour > 0) {
      result += `${hour}小时`;
      resultObj['hour'] = hour;
    }
    const minute = Math.floor((diffTime % oneHourTime) / onMinuteTime);
    if (minute > 0) {
      result += `${minute}分`;
      resultObj['minute'] = minute;
    }
    const second = Math.floor(diffTime % onMinuteTime);
    if (second > 0) {
      result += `${second}秒`;
      resultObj['second'] = second;
    }
    return result;
  },
  //对比新旧版本号
  VersionCompare(currVer, promoteVer) {
    currVer = currVer || '0.0.0';
    promoteVer = promoteVer || '0.0.0';
    if (currVer == promoteVer) return true;
    const currVerArr = currVer.split('.');
    const promoteVerArr = promoteVer.split('.');
    const len = Math.max(currVerArr.length, promoteVerArr.length);
    for (let i = 0; i < len; i++) {
      const proVal = ~~promoteVerArr[i],
        curVal = ~~currVerArr[i];
      if (proVal < curVal) {
        return false;
      } else if (proVal > curVal) {
        return true;
      }
    }
    return false;
  },
  /**
   * 从url中获取参数值
   * @param {string} 参数名
   * @return {string} 参数值
   * @author lichun 正则自己写的，不保证所有情况下都正确 ^-^ 凑合着用
   */
  getQueryString(name) {
    const reg = new RegExp(`([?&])${name}=([^&]*?)(#|&|$)`, 'i');
    const r = window.location.href.match(reg);
    if (r != null) {
      return decodeURIComponent(r[2]);
    }
    return '';
  },
  validMobilePhoneNumber: (MobilePhoneNumber: string) => {
    const reg = /^1(3|4|5|6|7|8|9)[0-9]\d{8}$/;
    return reg.test(MobilePhoneNumber);
  },
  imgToBase64(url: any) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth; // 使用 naturalWidth 为了保证图片的清晰度
        canvas.height = image.naturalHeight;
        canvas.style.width = `${canvas.width / window.devicePixelRatio}px`;
        canvas.style.height = `${canvas.height / window.devicePixelRatio}px`;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return null;
        }
        ctx.drawImage(image, 0, 0);
        const base64 = canvas.toDataURL('image/png');
        return resolve(base64);
      };
      image.onerror = (err) => {
        return reject(err);
      };
    });
  },
  md5EncryptQueryParams(params: Record<string, any>, method: 'get' | 'post' = 'get'): [string, number] {
    const timestamp = new Date().getTime();
    if (params === undefined) {
      return ['', timestamp];
    }
    let keys = Object.keys(params);
    // key 升序排列
    if (method === 'get') {
      keys = Object.keys(params).sort((a: string, b: string) => {
        const _a = a.split(''),
          _b = b.split('');
        let compareValue = 0;
        while (_a.length && compareValue === 0) {
          const compareCharFir = _a.shift(),
            compareCharSec = _b.shift();
          if (compareCharFir && compareCharSec) {
            compareValue = compareCharFir.charCodeAt(0) - compareCharSec.charCodeAt(0);
          } else if (compareCharFir && !compareCharSec) {
            compareValue = 1;
          } else if (!compareCharFir && compareCharSec) {
            compareValue = -1;
          }
        }
        return compareValue;
      });
    }
    // md5参数拼接
    let md5Str = '';
    if (keys.length) {
      if (method === 'get') {
        for (const key of keys) {
          md5Str += `${key}=${params[key]}&`;
        }
        md5Str += `timestamp=${timestamp}`;
      } else {
        const sortedObject = {};
        for (const key of keys) {
          sortedObject[key] = params[key];
        }
        md5Str = JSON.stringify(sortedObject);
        md5Str += `&timestamp=${timestamp}`;
      }
    } else {
      md5Str += `timestamp=${timestamp}`;
    }
    return [MD5(md5Str), timestamp];
  },
  dataURLtoFile(dataurl: string, filename = 'tupian.png') {
    /**
     * @MethodName: dataURLtoFile
     * @date: 2022/9/21 10:44 上午
     * @author: yzh
     * @params: dataurl base64字符串
     *          filename 文件名
     *  将base64转换为文件，dataurl为base64字符串，filename为文件名（必须带后缀名，如.jpg,.png）
     */
    dataurl = 'data:image/png;base64,' + dataurl;

    const arr = dataurl.split(',');
    const mime = (arr[0].match(/:(.*?);/) as Array<string>)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  },
};
