import { AuthProvider } from "react-admin";
import { createHeader } from "./dataProvider";
import { permission } from "process";

const apiUrl = import.meta.env.VITE_NAC_API_URL;

const fetchPermissions = async () => {
  // Fetching permssions
  const response = await fetch(`${apiUrl}/auth/permissions`, {
    method: "GET",
    headers: createHeader(),
  });
  const permission_data = await response.json();
  localStorage.setItem("permissions", JSON.stringify(permission_data));
  return;
};

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
    const status = error.status;
    if (status === 401) {
      localStorage.removeItem("access_token");
      throw new Error();
    }
    return Promise.resolve();
  },
  checkAuth: async () => {
    const accessToken = localStorage.getItem("access_token");
    const permissionsData = localStorage.getItem("permissions");
    if (!accessToken) {
      return Promise.reject();
    }

    if (!permissionsData) {
      // Refetch permissions because they are not found.
      await fetchPermissions();
    }

    // TODO?
    // This is specific to the Google authentication implementation
    // const jwt = JSON.parse(atob(accessToken.split(".")[1]));
    // const now = new Date();

    return Promise.resolve();
  },
  async handleCallback() {
    const query = window.location.hash.slice(window.location.hash.indexOf("?"));
    const urlParams = new URLSearchParams(query);
    const accessToken = urlParams.get("access_token");

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);

      // Fetching permssions
      await fetchPermissions();

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
      edit: "PUT",
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
        id: json_data.username,
        fullName: json_data.username,
        isAdmin: json_data.is_admin,
        rbacGroups: json_data.rbac_groups,
      }))
      .catch(() => {
        // Redirects to /login automatically in react-admin
        return Promise.reject();
      });
  },
};

export default authProvider;
