import {
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  CanAccess,
  Loading,
  Title,
  useCanAccess,
  useGetList,
} from "react-admin";
import { Link } from "react-router";

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

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

  const mapping = {
    discovered: discoveredTotal,
    pending: pendingTotal,
    authorized: authorizedTotal,
    rejected: rejectedTotal,
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Endpoints</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(mapping).map(([stateName, totalCount]) => (
            <TableRow key={stateName}>
              <TableCell component="th" scope="row">
                {capitalize(stateName)} Endpoints:{" "}
              </TableCell>
              <TableCell align="right">
                <Link
                  // color="inherit"
                  to={{
                    pathname: "/endpoint",
                    search: `filter=${JSON.stringify({ state__in: [stateName] })}`,
                  }}
                >
                  {totalCount}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const AccountingSummary = () => {
  const { total: activeSessionsTotal = 0 } = useGetList("accounting", {
    pagination: { page: 1, perPage: 0 },
    filter: { acct_stop_time__isnull: true },
  });

  const mapping = {
    active: {
      totalCount: activeSessionsTotal,
      filter: { acct_stop_time__isnull: true },
    },
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Accounting</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(mapping).map(
            ([stateName, { totalCount, filter }]) => (
              <TableRow key={stateName}>
                <TableCell component="th" scope="row">
                  {capitalize(stateName)} Sessions:{" "}
                </TableCell>
                <TableCell align="right">
                  <Link
                    to={{
                      pathname: "/accounting",
                      search: `filter=${JSON.stringify(filter)}`,
                    }}
                  >
                    {totalCount}
                  </Link>
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const Dashboard = () => {
  return (
    <Card>
      <Title title="CNaaS NAC" />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Dashboard
        </Typography>
      </CardContent>
      <CanAccess action="list" resource="endpoint">
        <Card>
          <CardContent>
            <EndpointSummary />
          </CardContent>
        </Card>
      </CanAccess>
      <CanAccess action="list" resource="accounting">
        <Card>
          <CardContent>
            <AccountingSummary />
          </CardContent>
        </Card>
      </CanAccess>
    </Card>
  );
};
