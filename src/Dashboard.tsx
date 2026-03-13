import {
  Box,
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { CanAccess, Title, useGetList } from "react-admin";
import { Link } from "react-router";

interface SummaryTableProps {
  title: string;
  rows: Array<{
    id: string;
    label: string;
    totalCount: number;
    pathname: string;
    filter: Record<string, unknown>;
  }>;
}

const SummaryTable = ({ title, rows }: SummaryTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{title}</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.label}
              </TableCell>
              <TableCell align="right">
                <Link
                  to={{
                    pathname: row.pathname,
                    search: `filter=${encodeURIComponent(JSON.stringify(row.filter))}`,
                  }}
                >
                  <Chip label={row.totalCount} />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const EndpointSummary = () => {
  const { total: discoveredTotal = 0 } = useGetList("endpoint", {
    pagination: { page: 1, perPage: 0 },
    filter: { state: "discovered" },
  });

  const { total: pendingTotal = 0 } = useGetList("endpoint", {
    pagination: { page: 1, perPage: 0 },
    filter: { state: "pending" },
  });

  const { total: authorizedTotal = 0 } = useGetList("endpoint", {
    pagination: { page: 1, perPage: 0 },
    filter: { state: "authorized" },
  });

  const { total: rejectedTotal = 0 } = useGetList("endpoint", {
    pagination: { page: 1, perPage: 0 },
    filter: { state: "rejected" },
  });

  const rows = [
    {
      id: "discoveredEndpoints",
      label: "Discovered endpoints",
      totalCount: discoveredTotal ?? 0,
      pathname: "/endpoint",
      filter: { state__in: "discovered" },
    },
    {
      id: "pendingEndpoints",
      label: "Pending endpoints",
      totalCount: pendingTotal ?? 0,
      pathname: "/endpoint",
      filter: { state__in: "pending" },
    },
    {
      id: "authorizedEndpoints",
      label: "Authorized endpoints",
      totalCount: authorizedTotal ?? 0,
      pathname: "/endpoint",
      filter: { state__in: "authorized" },
    },
    {
      id: "rejectedEndpoints",
      label: "Rejected endpoints",
      totalCount: rejectedTotal ?? 0,
      pathname: "/endpoint",
      filter: { state__in: "rejected" },
    },
  ];

  return <SummaryTable title="Endpoint" rows={rows} />;
};

const AccountingSummary = () => {
  const { total: activeSessionsTotal = 0 } = useGetList("accounting", {
    pagination: { page: 1, perPage: 0 },
    filter: { acct_stop_time__isnull: true },
  });

  const rows = [
    {
      id: "activeSessions",
      label: "Active sessions",
      totalCount: activeSessionsTotal ?? 0,
      pathname: "/accounting",
      filter: { acct_stop_time__isnull: true },
    },
  ];

  return <SummaryTable title="Accounting" rows={rows} />;
};

const AuthenticationSummary = () => {
  const now = new Date();

  now.setMinutes(0, 0, 0);

  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const todayStart = new Date(now.setHours(0, 0, 0, 0));

  const { total: lastHourCount } = useGetList("authentication", {
    pagination: { page: 1, perPage: 0 },
    filter: { auth_date__gte: oneHourAgo.toISOString() },
  });

  const { total: todayCount } = useGetList("authentication", {
    pagination: { page: 1, perPage: 0 },
    filter: { auth_date__gte: todayStart.toISOString() },
  });

  const rows = [
    {
      id: "lastHour",
      label: "Last Hour",
      totalCount: lastHourCount ?? 0,
      pathname: "/authentication",
      filter: { auth_date__gte: oneHourAgo.toISOString() },
    },
    {
      id: "today",
      label: "Today",
      totalCount: todayCount ?? 0,
      pathname: "/authentication",
      filter: { auth_date__gte: todayStart.toISOString() },
    },
  ];

  return <SummaryTable title="Authentication" rows={rows} />;
};

export const Dashboard = () => {
  return (
    <Card>
      <Title title="Dashboard" />
      <CardContent>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <CanAccess action="list" resource="endpoint">
              <Grid item size={4}>
                <EndpointSummary />
              </Grid>
            </CanAccess>
            <CanAccess action="list" resource="accounting">
              <Grid item size={4}>
                <AccountingSummary />
              </Grid>
            </CanAccess>
            <CanAccess action="list" resource="authentication">
              <Grid item size={4}>
                <AuthenticationSummary />
              </Grid>
            </CanAccess>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};
