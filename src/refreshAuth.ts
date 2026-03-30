export const createHeader = () => {
  const access_token = localStorage.getItem("access_token");

  if (!access_token) {
    return new Headers();
  }

  return new Headers({ Authorization: `Bearer ${access_token}` });
};

const apiUrl = import.meta.env.VITE_NAC_API_URL;

export const refreshAuth = async () => {
  const accessToken = localStorage.getItem("access_token");

  let needRefresh = false;
  if (accessToken) {
    const jwt = JSON.parse(atob(accessToken.split(".")[1]));
    if (jwt.exp < Date.now() / 1000) {
      needRefresh = true;
    }
  }

  if (!needRefresh) return Promise.resolve();

  try {
    console.log("Need to refresh access_token");

    const response = await fetch(`${apiUrl}/auth/refresh`, {
      method: "POST",
      credentials: "include", // Include refresh_token cookie
    });

    if (response.status < 200 || response.status >= 300) {
      console.log("Response, status", response.status);
      throw new Error(response.statusText);
    }

    const json_data = await response.json();

    const { access_token } = json_data;

    if (!access_token) return Promise.reject();

    // If we reach here, the cookie was sent and accepted!
    localStorage.setItem("access_token", access_token);
    return Promise.resolve();
  } catch (err) {
    console.error("Auth refresh error:", err);
    return Promise.reject(err);
  }
};
