export async function get(url) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  });
  const data = await response.json();
  return data;
}


export async function post(url, data, isFileUpload = false) {
  let responseData = null;
  let errorMessage = null;

  const headers = {
    'Authorization': `Bearer ${localStorage.getItem("access")}`
  };

  if (!isFileUpload) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: isFileUpload ? data : JSON.stringify(data)
  });
  
  if (response.status < 299) {
    responseData = await response.json();
  } else {
    errorMessage = await response.json();
  }
  return { responseData, errorMessage }  
}


export async function put(url, data) {
  let responseData = null;
  let errorMessage = null;

  const headers = {
    'Authorization': `Bearer ${localStorage.getItem("access")}`,
    'Content-Type': 'application/json'
  };

  const response = await fetch(url, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(data)
  });
  
  if (response.status < 299) {
    responseData = await response.json();
  } else {
    errorMessage = await response.json();
  }
  return { responseData, errorMessage }  
}

export async function remove(url) {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  });
  return response
}
