import PersonIcon from "@mui/icons-material/Person";
import {
  EndpointList,
  EndpointShow,
  EndpointEdit,
  EndpointCreate,
} from "./Endpoint";

export default {
  list: EndpointList,
  create: EndpointCreate,
  edit: EndpointEdit,
  show: EndpointShow,
  icon: PersonIcon,
  // recordRepresentation: (record: Network) => `"${record.reference}"`,
};
