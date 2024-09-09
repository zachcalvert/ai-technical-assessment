import { CURRENT_USER_URL, REFRESH_TOKEN_URL, TOKEN_URL } from '../api/urls';

const AuthService = {};

AuthService.login = (email, password) => {
  return new Promise((resolve, reject) => {
    fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    .then(res => {
      if (!res.ok) {
        resolve({ status: true, message: "Welcome!" });
      }
      return res.json();
    })
    .then(json => {
      localStorage.setItem("access", json.access);
      localStorage.setItem("refresh", json.refresh)
      resolve({ status: true, message: "Welcome to App!", token: json.access, refresh: json.refresh });
    })
    .catch(error => {
      console.log(error)
      resolve({ status: false, message: "Incorrect Email or Password." });
    })
  });
}

AuthService.user = false;
AuthService.getProfile = (hard = false) => {
  return new Promise(async (res, rej) => {
    if (localStorage.getItem("access")) {
      try {
        // Verify the token with the server
        const response = await fetch(CURRENT_USER_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });

        if (response.ok) {
          const data = await response.json()
          res(data)
        } else {
          // If verification fails, try to refresh the token
          if (localStorage.getItem("refresh")) {
            const refreshResponse = await fetch(REFRESH_TOKEN_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                refresh: localStorage.getItem("refresh"),
              }),
            });
            if (refreshResponse.ok) {
              localStorage.setItem("access", refreshResponse.access);
              localStorage.setItem("refresh", refreshResponse.refresh);
              res(refreshResponse)
            }
          }
        }
      } catch (error) {
        res(false);
      }
    }
    res(false)
  });
}

AuthService.logout = async () => {
  return new Promise((resolve) => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    resolve({ status: true, message: "Logged out successfully." });;
  })
}


export default AuthService;
