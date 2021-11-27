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

  const token = localStorage.getItem('jwt');

  if (token) {
    requestOptions.headers.Authorization = `Bearer ${token}`;
  }

  if (searchParams) {
    const params = new URLSearchParams(searchParams);

    urlWithParams = `${url}?${params.toString()}`;
  }

  return fetch('/api' + (urlWithParams || url), requestOptions)
    .then(response => response.json())
    .then(({ status, data }) => {
      callback(status, data);

      return data;
    })
    .catch(ex => {
      if (typeof callback === 'function') {
        callback('error', ex);
      }
    });
};

export default request;