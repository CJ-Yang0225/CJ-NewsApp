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

    dataType === 'xml' && xhr.overrideMimeType('text/xml');
    xhr.open(method, url, isAsync);
    method === 'POST' &&
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(method === 'GET' ? null : formatData(data));
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          switch (dataType?.toLowerCase()) {
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
