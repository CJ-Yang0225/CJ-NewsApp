const useAjax = Symbol('useAjax');

class HTTP {
  [useAjax](url = '/api', settings = {}) {
    const xhr = window.XMLHttpRequest
      ? new XMLHttpRequest()
      : new ActiveXObject('Microsoft.XMLHTTP');

    if (!xhr) {
      throw new Error('抱歉，此瀏覽器不支援非同步的 HTTP 請求');
    }

    let {
      method,
      type,
      isAsync,
      data,
      onSuccess,
      onError,
      onComplete,
      dataType,
      timeout,
    } = settings;
    method = (method || type || 'GET').toUpperCase();
    isAsync = isAsync || true;
    data = data || null;
    onSuccess = typeof onSuccess === 'function' ? onSuccess : () => {};
    onError =
      typeof onError === 'function'
        ? onError
        : (...reason) => {
            throw new Error(reason.join(' '));
          };
    onComplete = typeof onComplete === 'function' ? onComplete : () => {};
    dataType = dataType || 'json';
    timeout = timeout || 15000;

    xhr.open(method, url, isAsync);
    method === 'POST' &&
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    dataType === 'xml' && xhr.overrideMimeType('text/xml');
    xhr.send(method === 'GET' ? null : formatData(data));

    let timer = setTimeout(() => {
      xhr.abort();
      timer = null;
      throw new Error(url + ' 請求超時');
    }, timeout);

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        // 304 Not Modified: 說明無需再次傳輸請求的內容，也就是說可以使用快取的內容
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          switch (typeof dataType === 'string' && dataType.toLowerCase()) {
            case 'json':
              onSuccess(JSON.parse(xhr.responseText));
              break;

            case 'html':
              const doc = document.implementation.createHTMLDocument();
              doc.body.innerHTML = xhr.responseText;
              onSuccess(doc);
              break;

            case 'xml':
              onSuccess(xhr.responseXML);
              break;

            case 'text':
              onSuccess(xhr.responseText);
              break;

            default:
              onSuccess(JSON.parse(xhr.responseText));
          }
        } else {
          onError(
            xhr.status +
              ' ' +
              (xhr.statusText || xhr.responseText || xhr.response)
          );
        }
      }
      onComplete();
      clearTimeout(timer);
    };
  }

  ajax(url, settings) {
    this[useAjax](url, settings);
  }

  get(url, settings) {
    this[useAjax](url, { ...settings, method: 'GET' });
  }

  post(url, settings) {
    this[useAjax](url, { ...settings, method: 'POST' });
  }
}

function formatData(data) {
  // null == undefined 為 true
  if (data == undefined) return null;

  return Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}

export default HTTP;
