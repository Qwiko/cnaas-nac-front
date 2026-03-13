import DeviceHubIcon from '@mui/icons-material/DeviceHub';
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
  icon: DeviceHubIcon,
  // recordRepresentation: (record: Network) => `"${record.reference}"`,
};
