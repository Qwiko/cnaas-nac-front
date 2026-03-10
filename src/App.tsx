import { Admin, Resource } from "react-admin";
import { Layout } from "./Layout";

import authProvider from "./authProvider";
import dataProvider from "./dataProvider";

import type { ThemeOptions } from "@mui/material";
import endpoints from "./endpoints";
import endpoint_groups from "./endpoint_groups";
import policies from "./policies";
import accounting_logs from "./accounting";
import authentication_logs from "./authentication";
import vlans from "./vlans";

import { Dashboard } from "./Dashboard";

import { NACLogin } from "./Login";

const redirectLoginUrl = import.meta.env.VITE_REDIRECT_LOGIN_URL;

// --font-primary: "Inter";
// --font-alt: "Akkurat Mono";
// --color-primary1: #252425; /* Aska */
// --color-primary2: #e37426; /* Rost */
// --color-primary3: #ca402b; /* Bränd orange */
// --color-secondary1 #f7f7f7;  /* Dimma */
// --color-secondary2 #e9e8e8;  /* Moln */
// --color-secondary3 #b3b3b3;  /* Sten */
// --color-secondary4 #707070;  /* Skiffer */

const theme: ThemeOptions = {
  palette: {
    primary: {
      main: "#e37426",
      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: "#b3b3b3",
    },
  },
};
const darkTheme: ThemeOptions = {
  palette: {
    primary: {
      main: "#ca402b",
      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: "#707070",
    },
    mode: "dark",
  },
};

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
  </Admin>
);
