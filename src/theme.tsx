import type { ThemeOptions } from "@mui/material";

// --font-primary: "Inter";
// --font-alt: "Akkurat Mono";
// --color-primary1: #252425; /* Aska */
// --color-primary2: #e37426; /* Rost */
// --color-primary3: #ca402b; /* Bränd orange */
// --color-secondary1 #f7f7f7;  /* Dimma */
// --color-secondary2 #e9e8e8;  /* Moln */
// --color-secondary3 #b3b3b3;  /* Sten */
// --color-secondary4 #707070;  /* Skiffer */

export const theme: ThemeOptions = {
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
export const darkTheme: ThemeOptions = {
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
