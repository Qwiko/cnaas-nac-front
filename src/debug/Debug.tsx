import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Confirm,
  Create,
  SimpleForm,
  TextInput,
  TopToolbar,
  useDataProvider,
  useNotify,
  useRedirect,
  useRefresh,
  useRequireAccess,
  useTheme,
} from "react-admin";
import { Title, useGetList } from "react-admin";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { redirect } from "react-router";

const LoadingBox = () => (
  <Box display="flex" justifyContent="center" mt={4}>
    <CircularProgress />
  </Box>
);

export const StartDebugButton = () => {
  const redirect = useRedirect();

  return (
    <Button
      label="Start debug"
      startIcon={<AddIcon />}
      onClick={() => redirect("/debug/create")}
    />
  );
};

export const StopDebugButton = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();

  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    setOpen(false);

    try {
      await dataProvider.delete("debug", { id: "" });
      notify("Debug stopped");
      refresh();
    } catch (error) {
      notify("Debug stop failed", { type: "error" });
    }
  };

  return (
    <>
      <Button
        label="Stop debug"
        startIcon={<DeleteIcon />}
        onClick={() => setOpen(true)}
      />

      <Confirm
        isOpen={open}
        title="Stop debug?"
        content="Are you sure you want to stop debugging?"
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export const ClearDebugLogsButton = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();

  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    setOpen(false);

    try {
      await dataProvider.delete("debug/logs", { id: "" });
      notify("Debug logs cleared");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      refresh();
    } catch (error) {
      notify("Debug log clear failed", { type: "error" });
    }
  };

  return (
    <>
      <Button
        label="Clear debug logs"
        startIcon={<DeleteSweepIcon />}
        onClick={() => setOpen(true)}
      />

      <Confirm
        isOpen={open}
        title="Clear debug logs?"
        content="Are you sure you want to clear debug logs?"
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export const DebugList = () => {
  const { isPending: authIsPending } = useRequireAccess({
    action: "list",
    resource: "debug",
  });

  const [theme] = useTheme();

  const [selectedNode, setSelectedNode] = useState("");
  const [refreshInterval, setRefreshInterval] = useState(30000);

  const { data: debugLogs, isPending: logsArePending } = useGetList(
    "debug/logs",
    {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: "id", order: "DESC" },
    },
    { refetchInterval: refreshInterval },
  );

  const groupedLogs = useMemo(() => {
    if (!debugLogs) return {};
    return debugLogs.reduce((acc, log) => {
      const node = log.node_name || "Unknown Node";
      if (!acc[node]) {
        acc[node] = [];
      }
      acc[node].push(log);
      return acc;
    }, {});
  }, [debugLogs]);

  const availableNodes = Object.keys(groupedLogs);

  useEffect(() => {
    if (availableNodes.length > 0 && !selectedNode) {
      setSelectedNode(availableNodes[0]);
    }
  }, [availableNodes, selectedNode]);

  if (authIsPending || logsArePending) return <LoadingBox />;

  const logsToShow = groupedLogs[selectedNode] || [];

  const logString = logsToShow.map((log) => log.log_line).join("\n");

  return (
    <>
      <Title title="Debug Logs" />
      <TopToolbar>
        <StartDebugButton />
        <ClearDebugLogsButton />
        <StopDebugButton />
      </TopToolbar>

      {availableNodes.length === 0 ? (
        <Typography color="textSecondary">No logs found.</Typography>
      ) : (
        <>
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
                <InputLabel id="node-select-label">Select node</InputLabel>
                <Select
                  labelId="node-select-label"
                  value={selectedNode}
                  label="Select node"
                  onChange={(e) => setSelectedNode(e.target.value)}
                >
                  {availableNodes.map((nodeName) => (
                    <MenuItem key={nodeName} value={nodeName}>
                      {nodeName} ({groupedLogs[nodeName].length} entries)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
                <InputLabel id="refresh-rate-select-label">
                  Select refresh rate
                </InputLabel>
                <Select
                  labelId="refresh-rate-select-label"
                  value={refreshInterval}
                  label="Select refresh rate"
                  onChange={(e) => setRefreshInterval(e.target.value)}
                >
                  {[5000, 10000, 30000, 60000].map((interval) => (
                    <MenuItem key={interval} value={interval}>
                      Every {interval / 1000} seconds
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <SyntaxHighlighter
              language="log"
              style={theme == "dark" ? vscDarkPlus : vs}
              // showLineNumbers
              wrapLines
              wrapLongLines
              lineProps={{
                style: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
              }}
              customStyle={{
                border: 0,
                fontSize: "13px",
                background: "transparent",
              }}
            >
              {logString}
            </SyntaxHighlighter>
          </Card>
        </>
      )}
    </>
  );
};

export const DebugCreate = () => {
  const redirect = useRedirect();
  const notify = useNotify();

  const onSuccess = () => {
    notify("Setting up debugging, please wait.");

    new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
      redirect("/debug"),
    );
  };

  return (
    <Create
      resource="debug"
      mutationMode="pessimistic"
      mutationOptions={{ onSuccess }}
    >
      <SimpleForm>
        <TextInput source="username" label="Username" />
        <TextInput source="nas_identifier" label="NAS Identifier" />
        <TextInput source="nas_port_id" label="NAS Port ID" />
        <TextInput source="calling_station_id" label="Calling Station ID" />
        <TextInput source="called_station_id" label="Called Station ID" />
        <TextInput source="nas_ip_address" label="NAS IP Address" />
        <TextInput source="realm" label="Realm" />
      </SimpleForm>
    </Create>
  );
};
