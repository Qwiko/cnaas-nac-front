import { useRecordContext, CreateButton } from "react-admin";
import BugReportIcon from "@mui/icons-material/BugReport";

export const EndpointDebugCreateButton = () => {
  const record = useRecordContext();
  // if (!record) return;
  return (
    <CreateButton
      resource="debug"
      icon={<BugReportIcon />}
      label="Debug Endpoint"
      state={{
        record: {
          username: record.username,
          calling_station_id: record.calling_station_id,
        },
      }}
    />
  );
};
