import { Menu } from "react-admin";
import BugReportIcon from "@mui/icons-material/BugReport";

export const NACMenu = () => (
  <Menu>
    <Menu.DashboardItem />
    <Menu.ResourceItems />
    <Menu.Item
      to="/debug"
      primaryText="Debugging"
      leftIcon={<BugReportIcon />}
    />
  </Menu>
);
