import LanIcon from "@mui/icons-material/Lan";
import { UserList, UserShow, UserEdit, UserCreate } from "./User";

export default {
  list: UserList,
  create: UserCreate,
  edit: UserEdit,
  show: UserShow,
  icon: LanIcon,
  // recordRepresentation: (record: Network) => `"${record.reference}"`,
};
