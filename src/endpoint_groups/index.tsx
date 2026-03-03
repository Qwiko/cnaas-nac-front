import GroupIcon from '@mui/icons-material/Group';import {
  EndpointGroupList,
  EndpointGroupShow,
  EndpointGroupEdit,
  EndpointGroupCreate,
} from "./EndpointGroup";

export default {
  list: EndpointGroupList,
  show: EndpointGroupShow,
  edit: EndpointGroupEdit,
  create: EndpointGroupCreate,
  icon: GroupIcon,
  // recordRepresentation: (record: Network) => `"${record.reference}"`,
};
