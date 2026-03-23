import * as React from "react";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";

import {
  SimpleForm,
  useListContext,
  useNotify,
  useRefresh,
  useResourceContext,
  useDataProvider,
} from "react-admin";

import { useFormContext } from "react-hook-form";

export const BulkUpdateFormButton = (props) => {
  const { selectedIds, onUnselectItems } = useListContext();
  const resource = useResourceContext();

  const { data } = useListContext();

  const [open, setOpen] = useState(false);

  const notify = useNotify();
  const refresh = useRefresh();

  const dataprovider = useDataProvider();

  const handleOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = (e) => {
    e?.stopPropagation();
    setOpen(false);
  };

  const handleSubmit = async (values) => {
    try {
      if (!values || Object.keys(values).length === 0) {
        notify("No changes to update", { type: "warning" });
        return;
      }

      const promises = selectedIds.map((id) => {
        const original = data.find((record) => record.id === id) || {};

        return dataprovider.update(resource, {
          id,
          data: {
            ...original,
            ...values,
          },
        });
      });

      await Promise.all(promises);

      notify("Bulk update successful", { type: "success" });

      refresh();
      onUnselectItems();
      setOpen(false);
    } catch (error) {
      notify(`Error: ${error.message}`, { type: "error" });
    }
  };

  const FormActions = () => {
    const { handleSubmit } = useFormContext();

    return (
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>

        <Button onClick={handleSubmit(handleSubmitWrapper)} variant="contained">
          Save
        </Button>
      </DialogActions>
    );
  };

  const handleSubmitWrapper = (values) => {
    handleSubmit(values);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        disabled={selectedIds.length === 0}
        variant="text"
        size="small"
        color="primary"
        startIcon={<EditIcon />}
      >
        Update
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Bulk Update</DialogTitle>

        <SimpleForm onSubmit={handleSubmit} toolbar={false} record={{}}>
          <DialogContent>
            {React.Children.map(props.children, (child) =>
              React.isValidElement(child) ? child : null,
            )}
          </DialogContent>
          <FormActions />
        </SimpleForm>
      </Dialog>
    </>
  );
};
