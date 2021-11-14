const request = obj => {
  const { url, method, body, searchParams, callback } = obj;

  if (!url) {
    return null;
  }

  let urlWithParams;
  const requestOptions = {
    method: method || 'GET',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  if (searchParams) {
    const params = new URLSearchParams(searchParams);

    urlWithParams = `${url}?${params.toString()}`;
  }

  return fetch('/api' + (urlWithParams || url), requestOptions)
    .then(response => response.json())
    .then(json => {
      callback('OK', json);

      return json;
    })
    .catch(ex => {
      if (typeof callback === 'function') {
        callback('ERROR', ex);
      }
    });
};

export default request;