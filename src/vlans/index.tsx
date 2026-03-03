import LanIcon from "@mui/icons-material/Lan";
import { VlanList, VlanShow } from "./Vlan";

export default {
  list: VlanList,
  show: VlanShow,
  icon: LanIcon,
  // recordRepresentation: (record: Network) => `"${record.reference}"`,
};
