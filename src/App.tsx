import { Admin, CustomRoutes, Resource } from "react-admin";
import { Layout } from "./Layout";

import authProvider from "./authProvider";
import dataProvider from "./dataProvider";

import endpoints from "./endpoints";
import endpoint_groups from "./endpoint_groups";
import policies from "./policies";
import accounting_logs from "./accounting";
import authentication_logs from "./authentication";
import vlans from "./vlans";
import rbacs from "./rbacs";
import radius_clients from "./radius_clients";

import { Dashboard } from "./Dashboard";

import { NACLogin } from "./Login";
import { darkTheme, theme } from "./theme";
import { Route } from "react-router";
import EndpointImport from "./endpoints/EndpointImport";

const redirectLoginUrl = import.meta.env.VITE_REDIRECT_LOGIN_URL;

export const App = () => (
  <Admin
    theme={theme}
    darkTheme={darkTheme}
    authProvider={authProvider}
    dataProvider={dataProvider}
    loginPage={NACLogin(redirectLoginUrl)}
    layout={Layout}
    dashboard={Dashboard}
  >
    <Resource name="endpoint" {...endpoints} />
    <Resource name="endpoint_group" {...endpoint_groups} />
    <Resource name="policy" {...policies} />
    <Resource name="accounting" {...accounting_logs} />
    <Resource name="authentication" {...authentication_logs} />
    <Resource name="vlan" {...vlans} />
    <Resource name="rbac" {...rbacs} />
    <Resource name="radius_client" {...radius_clients} />
    <CustomRoutes>
      <Route path="/endpoint_import" element={<EndpointImport />} />
    </CustomRoutes>
  </Admin>
);
