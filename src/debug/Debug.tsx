import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { memo, useEffect, useMemo, useRef, useState } from "react";
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
  Title,
} from "react-admin";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { EventSource } from "eventsource";
import { createHeader } from "../dataProvider";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SyncIcon from "@mui/icons-material/Sync";
import ErrorIcon from "@mui/icons-material/Error";

const LoadingBox = () => (
  <Box display="flex" justifyContent="center" mt={4}>
    <CircularProgress />
  </Box>
);

interface MemoizedLogLineProps {
  line: string;
}

const MemoizedLogLine = memo(function MemoizedLogLine({
  line,
}: MemoizedLogLineProps) {
  const [theme] = useTheme();
  return (
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
        margin: 0,
        padding: "0px 0px",
        border: 0,
        fontSize: "13px",
        background: "transparent",
      }}
      PreTag="div"
    >
      {line}
    </SyntaxHighlighter>
  );
});

type ConnectionStatus = "connecting" | "connected" | "disconnected";

function ConnectionStatusChip({ status }: { status: ConnectionStatus }) {
  switch (status) {
    case "connected":
      return (
        <Tooltip title="Debug logs streaming is connected">
          <Chip
            color="success"
            icon={<CheckCircleIcon />}
            label="Connected"
            size="small"
          />
        </Tooltip>
      );

    case "connecting":
      return (
        <Tooltip title="Debug logs streaming is connecting">
          <Chip
            color="warning"
            icon={<SyncIcon className="spin" />}
            label="Connecting"
            size="small"
          />
        </Tooltip>
      );

    case "disconnected":
      return (
        <Tooltip title="Debug logs streaming is disconnected">
          <Chip
            color="error"
            icon={<ErrorIcon />}
            label="Disconnected"
            size="small"
          />
        </Tooltip>
      );
  }
}

const StartDebugButton = () => {
  const redirect = useRedirect();

  return (
    <Button
      label="Start debug"
      startIcon={<AddIcon />}
      onClick={() => redirect("/debug/create")}
    />
  );
};

const StopDebugButton = ({ setActiveDebugging }) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();

  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    setOpen(false);

    try {
      await dataProvider.delete("debug", { id: "" });
      setActiveDebugging(null);
      notify("Debug stopped");
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

const ClearDebugLogsButton = ({ setDebugLogs }) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();

  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    setOpen(false);

    try {
      await dataProvider.delete("debug/logs", { id: "" });
      notify("Debug logs cleared");
      setDebugLogs({});
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

  const dataProvider = useDataProvider();
  const notify = useNotify();

  const [retryCount, setRetryCount] = useState(0);
  const [activeDebugging, setActiveDebugging] = useState(null);
  const [status, setStatus] = useState("connecting");
  const [debugLogs, setDebugLogs] = useState([]);
  const [selectedNode, setSelectedNode] = useState("");
  const [availableNodes, setAvailableNodes] = useState(new Set());
  const [filter, setFilter] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);

  const codeRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    dataProvider.getOne("debug", { id: "" }).then((data) => {
      if (!cancelled && data?.data) {
        setActiveDebugging(data.data);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [dataProvider]);

  useEffect(() => {
    let reconnectTimeout;

    // Setup EventSource SSE debug log listener
    const eventSource = new EventSource(
      "http://localhost:8000/api/v2/debug/logs",
      {
        fetch: (input, init) =>
          fetch(input, {
            ...init,
            headers: {
              ...init.headers,
              Authorization: createHeader().get("Authorization"),
            },
          }),
      },
    );
    eventSource.addEventListener("message", (event) => {
      const log = JSON.parse(event.data);
      const node_name = log.node_name;
      setAvailableNodes((prev) => {
        if (prev.has(node_name)) {
          return prev;
        }

        const next = new Set(prev);
        next.add(node_name);
        return next;
      });
      setDebugLogs((prev) => {
        const prev_copy = { ...prev };
        if (!Object.keys(prev_copy).includes(node_name)) {
          prev_copy[node_name] = [];
        }

        const node_logs = prev_copy[node_name];

        prev_copy[node_name] = [...node_logs, log].slice(-1000);
        return prev_copy;
      });
    });

    eventSource.onopen = () => {
      setStatus("connected");
    };

    eventSource.onerror = (err) => {
      console.error("SSE Error:", err);
      setStatus("disconnected");
      eventSource.close();

      reconnectTimeout = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
      }, 3000); // 3-second delay
    };

    return () => {
      eventSource.close();
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [notify, retryCount]);

  const displayedLogs = useMemo(() => {
    if (
      !selectedNode ||
      !debugLogs ||
      !Object.keys(debugLogs).includes(selectedNode)
    )
      return [];
    return debugLogs[selectedNode].filter((logObj) =>
      logObj.log_line.includes(filter),
    );
  }, [debugLogs, filter, selectedNode]);

  useEffect(() => {
    if (autoScroll && codeRef.current) {
      // scrollIntoView jumps the container to this element
      codeRef.current.scrollTop = codeRef.current.scrollHeight;
    }
  }, [displayedLogs, autoScroll]);

  useEffect(() => {
    if (selectedNode || availableNodes.size === 0) {
      return;
    }

    setSelectedNode(availableNodes.values().next().value);
  }, [availableNodes, selectedNode]);

  if (authIsPending) return <LoadingBox />;

  return (
    <>
      <Title title="Live debug logs" />
      <TopToolbar>
        <StartDebugButton />
        <ClearDebugLogsButton setDebugLogs={setDebugLogs} />
        <StopDebugButton setActiveDebugging={setActiveDebugging} />
      </TopToolbar>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <FormGroup>
            <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
              <InputLabel id="node-select-label">Select node</InputLabel>
              <Select
                labelId="node-select-label"
                value={selectedNode}
                label="Select node"
                onChange={(e) => setSelectedNode(e.target.value)}
              >
                {[...availableNodes].map((nodeName) => (
                  <MenuItem key={nodeName} value={nodeName}>
                    {nodeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              sx={{ mb: 2, mt: 1 }}
              label="Filter logs"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={autoScroll}
                  onChange={(event) => setAutoScroll(event.target.checked)}
                />
              }
              label="Autoscroll logs"
            />
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <FormHelperText>
                    Displaying only the latest 1000 lines
                  </FormHelperText>
                  <FormHelperText>
                    {activeDebugging === null ? (
                      <>No active debugging</>
                    ) : (
                      <>
                        Current active conditions:{" "}
                        {JSON.stringify(activeDebugging, (key, value) => {
                          if (key !== "id" && value !== null) return value;
                        })}
                      </>
                    )}
                  </FormHelperText>
                </Box>
                <ConnectionStatusChip status={status} />
              </Box>
            </Box>
          </FormGroup>
        </CardContent>
      </Card>

      <Card
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 423px)",
          // maxHeight: "80%",
          padding: "8px",
        }}
      >
        {displayedLogs.length == 0 ? (
          <CardContent>
            <Typography>No Logs</Typography>
          </CardContent>
        ) : (
          <div
            ref={codeRef}
            style={{
              maxHeight: "100%",
              overflowY: "auto",
            }}
          >
            {displayedLogs.map((logObj) => (
              // Use a unique ID for the key if available, otherwise index is acceptable for append-only logs
              <MemoizedLogLine key={logObj.id} line={logObj.log_line} />
            ))}
          </div>
        )}
      </Card>
    </>
  );
};

export const DebugCreate = () => {
  const redirect = useRedirect();
  const notify = useNotify();

  const onSuccess = () => {
    notify("Debugging started");
    redirect("/debug");
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
