import { Box, Card } from "@mui/material";
import { Login } from "react-admin";
import { Button, CardContent } from "@mui/material";


export const NACLogin = (redirectLoginUrl: string) => (
  <Login>
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="center">
          <Button variant="contained" color="primary" href={redirectLoginUrl}>
            Sign in with SSO
          </Button>
        </Box>
      </CardContent>
    </Card>
  </Login>
);
