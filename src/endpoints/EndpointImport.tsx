import {
  Title,
  Form,
  FileInput,
  FileField,
  SaveButton,
  Toolbar,
  useNotify,
  useRedirect,
  useDataProvider,
  useCanAccess,
  useCreate,
  useRequireAccess,
  Button,
} from "react-admin";
import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import Papa from "papaparse";
import { useState } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useFormContext } from "react-hook-form";
import { isMacAddress } from "../shared/Shared";

const csvTemplate =
  "username,group_name,group_id,description\n00:00:00:00:00:00,group_name,,example description\n11:22:33:44:55:66,,1,";

const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvTemplate}`);

const LoadingBox = () => (
  <Box display="flex" justifyContent="center" mt={4}>
    <CircularProgress />
  </Box>
);

export const EndpointImport = () => {
  const notify = useNotify();
  const dataProvider = useDataProvider();

  const { isPending: authIsPending } = useRequireAccess({
    action: "create",
    resource: "endpoint",
  });

  const [step, setStep] = useState(0); // 0 = Start, 1 = Validate, 2 = Import
  const [parsedData, setParsedData] = useState([]);
  const [importErrors, setImportErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (authIsPending) return <LoadingBox />;

  const checkAddFile = (event) => {
    if (event?.path) {
      setStep(1);
      setImportErrors([]);
    } else {
      setStep(0);
      setImportErrors([]);
    }
  };

  const handleValidate = async (data) => {
    const file = data.csv_file?.rawFile;

    setImportErrors([]);
    setIsProcessing(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: async (results) => {
        const rows = results.data;
        const newErrors = [];

        if (rows.length > 1000) {
          notify("Import is limited to max 1000 rows.", { type: "error" });
          setIsProcessing(false);
          setStep(0);
          return;
        }

        // Check required fields

        for (const [index, row] of rows.entries()) {
          const rowNumber = index + 2;
          if (row.username && !isMacAddress(row.username)) {
            newErrors.push(`Row ${rowNumber}: Username must be a mac address.`);
          }

          if (!row.username || (!row.group_name && !row.group_id)) {
            newErrors.push(
              `Row ${rowNumber}: username and group_name or group_id fields are required.`,
            );
          }

          if (row.group_name && row.group_id) {
            newErrors.push(
              `Row ${rowNumber}: group_name and group_id cannot be set at the same time.`,
            );
          }

          if (row.group_id && isNaN(row.group_id)) {
            newErrors.push(`Row ${rowNumber}: group_id must be a number!`);
          }
        }

        try {
          // 1. Fetch existing IDs from the database
          const rowUsernames = rows.map((row) => row.username).filter(Boolean);
          const rowGroupNames = rows
            .map((row) => row.group_name)
            .filter(Boolean);
          const rowGroupIds = rows
            .map((row) => row.group_id)
            .filter((v) => !isNaN(v))
            .filter(Boolean);
          let existingUsernames = [];
          const existingGroups = [];

          if (rowUsernames.length > 0) {
            const { data: existingRecords } =
              await dataProvider.getManyReference("endpoint", {
                filter: {
                  username__in: rowUsernames,
                  calling_station_id__in: rowUsernames,
                },
                pagination: { page: 1, perPage: 1000 },
                sort: { field: "username", order: "ASC" },
                target: "",
                id: "",
              });
            existingUsernames = existingRecords.map((record) =>
              String(record.username),
            );
          }

          if (rowGroupNames.length > 0) {
            const { data: groups } = await dataProvider.getManyReference(
              "endpoint_group",
              {
                filter: { name__in: rowGroupNames },
                pagination: { page: 1, perPage: 1000 },
                sort: { field: "name", order: "ASC" },
                target: "",
                id: "",
              },
            );
            existingGroups.push(...groups);
          }

          if (rowGroupIds.length > 0) {
            const { data: groups } = await dataProvider.getManyReference(
              "endpoint_group",
              {
                filter: { id__in: rowGroupIds },
                pagination: { page: 1, perPage: 1000 },
                sort: { field: "name", order: "ASC" },
                target: "",
                id: "",
              },
            );
            existingGroups.push(...groups);
          }

          // 2. Validate each row
          for (const [index, row] of rows.entries()) {
            const rowNumber = index + 2;
            if (
              row.username &&
              existingUsernames.includes(String(row.username))
            ) {
              newErrors.push(
                `Row ${rowNumber}: Endpoint with username: "${row.username}" already exists.`,
              );
            }
            if (!row.username) {
              newErrors.push(
                `Row ${rowNumber}: Missing required "username" field.`,
              );
            }

            if (rows.filter((r) => r.username == row.username).length > 1) {
              newErrors.push(
                `Row ${rowNumber}:  Endpoint with username: "${row.username}" is defined multiple times.`,
              );
            }

            // Check for group_name
            if (
              row.group_name &&
              !existingGroups.map((g) => g.name).includes(row.group_name)
            ) {
              newErrors.push(
                `Row ${rowNumber}:  Group with name: "${row.group_name}" does not exist.`,
              );
            }

            // Check for group_id
            if (
              row.group_id &&
              !isNaN(row.group_id) &&
              !existingGroups.map((g) => g.id).includes(Number(row.group_id))
            ) {
              newErrors.push(
                `Row ${rowNumber}:  Group with id: "${row.group_id}" does not exist.`,
              );
            }
          }

          // 3. Handle Validation Results
          if (newErrors.length > 0) {
            setImportErrors(newErrors.sort());
            notify("Validation failed. Please fix the errors in your CSV.", {
              type: "warning",
            });
            setStep(0);
          } else {
            // Map group_name to group_id, and filter keys
            const parsedRows = rows.map((row) => {
              const parsedRow = {
                username: row.username,
                group_id: row.group_id
                  ? row.group_id
                  : existingGroups.find((v) => v.name == row.group_name).id,
                description: row.description,
              };
              return parsedRow;
            });
            setParsedData(parsedRows); // Save the valid data to state
            setStep(2); // Move to Step 2
            notify("Validation successful! Ready to import.", {
              type: "success",
            });
          }
        } catch (error) {
          setImportErrors([`API Error during validation: ${error.message}`]);
        } finally {
          setIsProcessing(false);
        }
      },
      error: (error) => {
        setImportErrors([`Failed to parse CSV: ${error.message}`]);
        setIsProcessing(false);
      },
    });
  };

  const handleSubmit = async () => {
    setIsProcessing(true);

    let successCount = 0;
    const newErrors = [];

    for (const [index, row] of parsedData.entries()) {
      const rowNumber = index + 2;
      try {
        await dataProvider.create("endpoint", { data: row });
        successCount++;
      } catch (error) {
        newErrors.push(
          `Row ${rowNumber}: Error: ${JSON.stringify(error.body)}`,
        );
      }
    }

    if (newErrors.length === 0) {
      notify(`Successfully imported ${successCount} endpoints!`, {
        type: "success",
      });
    } else {
      setImportErrors(newErrors);
      notify(
        `Import complete. ${successCount} succeeded, ${newErrors.length} failed.`,
        { type: "warning" },
      );
    }
    setIsProcessing(false);
    setStep(0);
    setParsedData([]);
  };

  const CustomToolbar = () => {
    const { getValues } = useFormContext();

    return (
      <Toolbar>
        <Button
          onClick={() => handleValidate(getValues())}
          startIcon={<VerifiedIcon />}
          label="Validate"
          variant="contained"
          size="medium"
          disabled={step != 1}
        >
          <VerifiedIcon />
        </Button>
        <SaveButton label="Import" disabled={step != 2} />
      </Toolbar>
    );
  };

  return (
    <>
      <Card sx={{ mt: 2 }}>
        <Title title="Import Endpoints" />
        <CardContent>
          <Typography variant="body1" gutterBottom>
            Upload a CSV file to bulk import endpoints, reference{" "}
            <a href={encodedUri} download="endpoint_import_template.csv">
              csv-file.
            </a>
          </Typography>

          <Form onSubmit={handleSubmit}>
            <FileInput
              source="csv_file"
              label="CSV File"
              accept={{ "application/csv": [".csv"] }}
              onChange={(e) => checkAddFile(e)}
              onRemove={() => setStep(0)}
            >
              <FileField source="src" title="title" />
            </FileInput>
            <CustomToolbar />
          </Form>
        </CardContent>
      </Card>
      {isProcessing && <LoadingBox />}
      {importErrors.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Errors</AlertTitle>
          <List dense sx={{ pt: 0, pb: 0 }}>
            {importErrors.map((err, idx) => (
              <ListItem key={idx} sx={{ py: 0 }}>
                <Typography variant="body2" color="error">
                  • {err}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Alert>
      )}
    </>
  );
};

export default EndpointImport;
