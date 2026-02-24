import LanIcon from "@mui/icons-material/Lan";
import {
  AssignmentRuleList,
  AssignmentRuleShow,
  AssignmentRuleEdit,
  AssignmentRuleCreate,
} from "./AssignmentRule";


export default {
  list: AssignmentRuleList,
  create: AssignmentRuleCreate,
  edit: AssignmentRuleEdit,
  show: AssignmentRuleShow,
  icon: LanIcon,
  // recordRepresentation: (record: Network) => `"${record.reference}"`,
};
