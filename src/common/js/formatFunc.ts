// @ts-nocheck
/**
 * 添加一些格式化方法
 */

// 电话脱敏方法
export const formatPhoneSens = (phone) => {
  if (phone) {
    const str = `${phone}`;
    return `${str.slice(0, 3)}****${str.slice(7)}`;
  }
  return phone;
};

/** 在父字符串中匹配子字符串并返回子字符串两侧的字符串 */
export const highLightText = (fatherStr, childStr) => {
  if (fatherStr && childStr) {
    const arr = fatherStr.split(childStr);
    if (arr.length > 1) {
      return `<span>${arr[0]}<span style="color: #F94C09">${childStr}</span>${arr.slice(1).join(childStr)}</span>`;
    }
    return fatherStr;
  }
  return fatherStr;
};

export const jsonp = (url, params) => {
  if (!url) {
    return;
  }
  let paramsStr = '?';
  Object.entries(params).forEach(([key, val], ind) => {
    paramsStr = `${paramsStr}${ind === 0 ? '' : '&'}${key}=${val}`;
  });
  return new Promise((resolve, reject) => {
    window.jsonCallBack = (result) => {
      resolve(result);
    };
    const JSONP = document.createElement('script');
    JSONP.type = 'text/javascript';
    JSONP.src = `${url}${paramsStr}&callback=jsonCallBack`;
    document.getElementsByTagName('head')[0].appendChild(JSONP);
    setTimeout(() => {
      document.getElementsByTagName('head')[0].removeChild(JSONP);
    }, 500);
  });
};

export const formatCityData = (data) => {
  // eslint-disable-next-line one-var
  const city = {},
    formatted = [];
  for (const value of Object.values(data)) {
    if (!city[value.province_name]) {
      city[value.province_name] = {
        value: '' + value.province_id,
        text: value.province_name,
        children: []
      };
    }
    city[value.province_name].children.push({
      value: '' + value.city_id,
      text: value.city_name
    });
  }
  for (const value of Object.values(city)) {
    formatted.push(value);
  }
  return formatted;
};

/**
 * 函数节流
 * @param {Function} fn 需要调用的方法
 * @param {Number} wait 延迟时间
 */
export const throttle = (fn, delay) => {
  let last = 0;
  return function () {
    const curr = +new Date();
    if (curr - last > delay) {
      fn.apply(this, arguments);
      last = curr;
    }
  };
};
