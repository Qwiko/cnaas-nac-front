import PolicyIcon from "@mui/icons-material/Policy";
import { PolicyList, PolicyShow, PolicyEdit, PolicyCreate } from "./Policy";

export default {
  list: PolicyList,
  create: PolicyCreate,
  edit: PolicyEdit,
  show: PolicyShow,
  icon: PolicyIcon,
  // recordRepresentation: (record: Network) => `"${record.reference}"`,
};
