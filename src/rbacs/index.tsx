import LanIcon from "@mui/icons-material/Lan";
import { RBACList, RBACShow, RBACEdit, RBACCreate } from "./RBAC";

export default {
  list: RBACList,
  show: RBACShow,
  edit: RBACEdit,
  create: RBACCreate,
  icon: LanIcon,
  // recordRepresentation: (record: Network) => `"${record.reference}"`,
};
