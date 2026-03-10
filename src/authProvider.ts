import { AuthProvider } from "react-admin";
import { createHeader, refreshAuth } from "./refreshAuth";

const apiUrl = import.meta.env.VITE_API_URL;

const authProvider: AuthProvider = {
  login: () => {
    // Not used
    return Promise.resolve();
  },
  logout: () => {
    return fetch(`${apiUrl}/auth/logout`, {
      method: "POST",
      headers: createHeader(),
    })
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          // If the API says 401 or 403, the session is invalid
          throw new Error(response.statusText);
        }
        localStorage.clear();
        return Promise.resolve();
      })
      .catch(() => {
        // Redirects to /login automatically in react-admin
        localStorage.clear();
        return Promise.reject();
      });
  },
  async checkError(error) {
    console.log("In checkerror");

    const status = error.status;
    if (status === 401) {
      localStorage.removeItem("access_token");
      throw new Error();
    }
    return Promise.resolve();
  },
  checkAuth: () => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      return Promise.reject();
    }

    // This is specific to the Google authentication implementation
    const jwt = JSON.parse(atob(accessToken.split(".")[1]));
    const now = new Date();

    if (now.getTime() > jwt.exp * 1000) {
      // Try to refresh
      return refreshAuth();
    }
    return Promise.resolve();
  },
  async handleCallback() {
    const query = window.location.hash.slice(window.location.hash.indexOf("?"));
    const urlParams = new URLSearchParams(query);
    const accessToken = urlParams.get("access_token");

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);

      // Fetching permssions
      const response = await fetch(`${apiUrl}/auth/permissions`, {
        method: "GET",
        headers: createHeader(),
      });
      const permission_data = await response.json();
      localStorage.setItem("permissions", JSON.stringify(permission_data));

      // Redirect to start
      window.location.replace(window.location.origin);

      return Promise.resolve();
    } else {
      console.error("Callback Error");
      return Promise.reject();
    }
  },
  async canAccess({ action, resource }) {
    const permissionsString = localStorage.getItem("permissions");
    const permissions = permissionsString
      ? JSON.parse(permissionsString)
      : null;

    const actionMap = {
      list: "GET",
      show: "GET",
      create: "POST",
      update: "PUT",
      delete: "DELETE",
    };

    const mappedAction = actionMap[action as keyof typeof actionMap];

    const permissionActions = permissions[resource];

    if (!permissionActions || !Array.isArray(permissionActions)) {
      return false;
    }

    return permissionActions.includes(mappedAction);
  },
  getIdentity: () => {
    return fetch(`${apiUrl}/auth/me`, {
      method: "GET",
      headers: createHeader(),
    })
      .then((response) => response.json())
      .then((json_data) => ({
        id: json_data.name,
        fullName: json_data.name,
      }))
      .catch(() => {
        // Redirects to /login automatically in react-admin
        return Promise.reject();
      });
  },
};

export default authProvider;
