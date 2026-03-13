import GroupIcon from '@mui/icons-material/Group';
import {
  RadiusClientList,
  RadiusClientShow,
  RadiusClientEdit,
  RadiusClientCreate,
} from "./RadiusClient";

export default {
  list: RadiusClientList,
  show: RadiusClientShow,
  edit: RadiusClientEdit,
  create: RadiusClientCreate,
  icon: GroupIcon,
  // recordRepresentation: (record: Network) => `"${record.reference}"`,
};
