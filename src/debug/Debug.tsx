import { Padding } from "@mui/icons-material";
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
  Create,
  SimpleForm,
  TextInput,
  useRequireAccess,
  useTheme,
} from "react-admin";
import { Title, useGetList } from "react-admin";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";

const LoadingBox = () => (
  <Box display="flex" justifyContent="center" mt={4}>
    <CircularProgress />
  </Box>
);

export const DebugList = () => {
  const { isPending: authIsPending } = useRequireAccess({
    action: "list",
    resource: "debug",
  });

  const [theme, _] = useTheme();

  const [selectedNode, setSelectedNode] = useState("");

  const { data: debugLogs, isPending: logsArePending } = useGetList(
    "debug/logs",
    {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: "id", order: "DESC" },
    },
    { refetchInterval: 30000 },
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

  console.log(theme, theme == "dark", theme == "light");

  return (
    <>
      <Title title="Debug Logs" />

      {availableNodes.length === 0 ? (
        <Typography color="textSecondary">No logs found.</Typography>
      ) : (
        <>
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
                <InputLabel id="node-select-label">Select Node</InputLabel>
                <Select
                  labelId="node-select-label"
                  value={selectedNode}
                  label="Select Node"
                  onChange={(e) => setSelectedNode(e.target.value)}
                >
                  {availableNodes.map((nodeName) => (
                    <MenuItem key={nodeName} value={nodeName}>
                      {nodeName} ({groupedLogs[nodeName].length} entries)
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
  return (
    <Create redirect="list" mutationMode="pessimistic">
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
