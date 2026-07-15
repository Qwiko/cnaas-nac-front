import { Box, Chip, MenuItem } from "@mui/material";
import type { ReactNode } from "react";
import {
  Layout as RALayout,
  CheckForApplicationUpdate,
  Logout,
  AppBar,
  UserMenu,
  TitlePortal,
  useGetIdentity,
} from "react-admin";
import CheckIcon from "@mui/icons-material/Check";
import { NACMenu } from "./Menu";

const NACUserInfo = () => {
  const { data, isPending, error } = useGetIdentity();
  if (isPending || error) return;

  return (
    <>
      {data.isAdmin === true && (
        <MenuItem>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            Admin:
            <CheckIcon color="success" />
          </Box>
        </MenuItem>
      )}
      {data.rbacGroups.length > 0 && (
        <MenuItem>
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <span style={{ fontWeight: 500 }}>Groups</span>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.5 }}>
              {data.rbacGroups.map((group) => (
                <Chip key={group} label={group} size="small" />
              ))}
            </Box>
          </Box>
        </MenuItem>
      )}
    </>
  );
};

const NACAppBar = () => (
  <AppBar
    userMenu={
      <UserMenu>
        <NACUserInfo />
        <Logout />
      </UserMenu>
    }
  >
    <TitlePortal />
    {/* <SettingsButton /> */}
  </AppBar>
);

export const Layout = ({ children }: { children: ReactNode }) => (
  <RALayout appBar={NACAppBar} menu={NACMenu}>
    {children}
    <CheckForApplicationUpdate />
  </RALayout>
);
