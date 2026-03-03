import { Button, Tooltip, Typography } from "@mui/material";
import { Grid } from "@mui/system";
import {
  BooleanField,
  Create,
  DataTable,
  List,
  NumberField,
  Show,
  SimpleShowLayout,
  TextField,
  BooleanInput,
  Edit,
  NumberInput,
  SimpleForm,
  TextInput,
  ArrayField,
  ArrayInput,
  SimpleFormIterator,
  SelectInput,
  SelectField,
  FormDataConsumer,
  ReferenceInput,
  ReferenceField,
  useListContext,
  useRecordContext,
  DeleteButton,
  EditButton,
  CloneButton,
  ButtonProps,
  TopToolbar,
} from "react-admin";
import AddIcon from "@mui/icons-material/Add";
import { useFormContext } from "react-hook-form";
const PolicyFilters = [<TextInput label="Search" source="q" alwaysOn />];

export const PolicyList = () => (
  <List filters={PolicyFilters}>
    <DataTable>
      <DataTable.Col source="name" />
      <DataTable.Col source="description" />
      <DataTable.NumberCol source="priority" />

      <DataTable.Col source="match_logic" />
      <DataTable.Col source="enabled">
        <BooleanField source="enabled" />
      </DataTable.Col>
    </DataTable>
  </List>
);

const PolicyShowActions = () => (
  <TopToolbar>
    <CloneButton />
    <EditButton />
    <DeleteButton mutationMode="pessimistic" />
  </TopToolbar>
);

const PolicyShowConditionValue = () => {
  const { selectedIds, onToggleItem } = useListContext();
  const record = useRecordContext();

  if (record.attribute == "group_id") {
    return <ReferenceField reference="endpoint_group" source="value" />;
  } else {
    return <TextField source="value" />;
  }
};

const AddVlanRepliesButton = (props: ButtonProps) => {
  const { getValues, setValue } = useFormContext();
  return (
    <Tooltip title="Add necessary replies to set a VLAN id.">
      <Button
        component="label"
        variant="contained"
        onClick={() => {
          const replies = getValues("replies");
          const newReplies = replies.concat([
            {
              attribute: "Tunnel-Medium-Type",
              operator: ":=",
              value: "IEEE-802",
            },
            { attribute: "Tunnel-Type", operator: ":=", value: "VLAN" },
            {
              attribute: "Tunnel-Private-Group-Id",
              operator: ":=",
              value: "Insert vlan id here",
            },
          ]);
          setValue("replies", newReplies);
        }}
        startIcon={<AddIcon />}
      >
        Add VLAN replies
      </Button>
    </Tooltip>
  );
};

export const PolicyShow = () => (
  <Show actions={<PolicyShowActions />}>
    <SimpleShowLayout>
      <TextField source="name" />
      <TextField source="description" />
      <NumberField source="priority" />
      <SelectField
        source="port_type"
        emptyText="Any"
        choices={[
          { id: "Ethernet", name: "Wired only" },
          { id: "Wireless-802.11", name: "Wireless only" },
        ]}
      />
      <SelectField
        source="client_type"
        emptyText="Any"
        choices={[
          { id: "MAB", name: "MAB only" },
          { id: "EAP", name: "EAP-TLS only" },
        ]}
      />
      <SelectField
        source="match_logic"
        choices={[
          { id: "AND", name: "AND" },
          { id: "OR", name: "OR" },
        ]}
      />

      <BooleanField source="enabled" />

      <ArrayField source="conditions">
        <DataTable bulkActionButtons={false}>
          <DataTable.Col source="attribute">
            <SelectField
              source="attribute"
              choices={[
                { id: "username", name: "Username" },
                { id: "nas_identifier", name: "NAS Identifier" },
                { id: "nas_port_id", name: "NAS Port ID" },
                { id: "calling_station_id", name: "Calling Station ID" },
                { id: "called_station_id", name: "Called Station ID" },
                { id: "nas_ip_address", name: "NAS IP Address" },
                { id: "group_id", name: "Group" },
              ]}
            />
          </DataTable.Col>
          <DataTable.Col source="operator">
            <SelectField
              source="operator"
              choices={[
                { id: "==", name: "Equals" },
                { id: "!=", name: "Not equals" },
                { id: "in", name: "Contains" },
                { id: "startswith", name: "Starts with" },
                { id: "endswith", name: "Ends with" },
                { id: "regex", name: "Regex" },
                { id: "in_list", name: "In list" },
              ]}
            />
          </DataTable.Col>
          <DataTable.Col source="value">
            <PolicyShowConditionValue />
          </DataTable.Col>
        </DataTable>
      </ArrayField>
      <ArrayField source="replies">
        <DataTable bulkActionButtons={false}>
          <DataTable.Col source="attribute">
            <TextField source="attribute" />
          </DataTable.Col>
          <DataTable.Col source="operator">
            <SelectField
              source="operator"
              choices={[
                { id: "=", name: "Equals" },
                { id: ":=", name: "Set equals" },
              ]}
            />
          </DataTable.Col>
          <DataTable.Col source="value">
            <PolicyShowConditionValue />
          </DataTable.Col>
        </DataTable>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);

const PolicyCreateEdit = () => (
  <SimpleForm>
    <Grid container spacing={4}>
      <Grid size={6}>
        <TextInput source="name" isRequired />
      </Grid>
      <Grid size={6}>
        <TextInput source="description" />
      </Grid>
    </Grid>

    <NumberInput source="priority" defaultValue={100} />
    <BooleanInput source="enabled" />
    <Typography variant="h6" gutterBottom>
      Pre filters
    </Typography>
    <Grid container spacing={4}>
      <Grid size={6}>
        <SelectInput
          source="port_type"
          resettable
          choices={[
            { id: "Ethernet", name: "Wired only" },
            { id: "Wireless-802.11", name: "Wireless only" },
          ]}
        />
      </Grid>
      <Grid size={6}>
        <SelectInput
          source="client_type"
          resettable
          choices={[
            { id: "MAB", name: "MAB only" },
            { id: "EAP", name: "EAP-TLS only" },
          ]}
        />
      </Grid>
    </Grid>

    <Typography variant="h6" gutterBottom>
      Conditions
    </Typography>
    <SelectInput
      source="match_logic"
      isRequired
      choices={[
        { id: "AND", name: "AND" },
        { id: "OR", name: "OR" },
      ]}
    />

    <ArrayInput source="conditions">
      <SimpleFormIterator inline={true}>
        <SelectInput
          source="attribute"
          choices={[
            { id: "username", name: "Username" },
            { id: "nas_identifier", name: "NAS Identifier" },
            { id: "nas_port_id", name: "NAS Port ID" },
            { id: "calling_station_id", name: "Calling Station ID" },
            { id: "called_station_id", name: "Called Station ID" },
            { id: "nas_ip_address", name: "NAS IP Address" },
            { id: "group_id", name: "Endpoint Group" },
          ]}
          isRequired
        />

        <FormDataConsumer<{ attribute: string }>>
          {({
            formData, // The whole form data
            scopedFormData, // The data for this item of the ArrayInputBase
            ...rest
          }) => {
            if (scopedFormData.attribute == "group_id") {
              return (
                <>
                  <SelectInput
                    source="operator"
                    choices={[{ id: "==", name: "Equals" }]}
                    isRequired
                  />

                  <ReferenceInput
                    reference="endpoint_group"
                    source="value"
                    isRequired
                  />
                </>
              );
            }
            return (
              <>
                <SelectInput
                  source="operator"
                  choices={[
                    { id: "==", name: "Equals" },
                    { id: "!=", name: "Not equals" },
                    { id: "in", name: "Contains" },
                    { id: "startswith", name: "Starts with" },
                    { id: "endswith", name: "Ends with" },
                    { id: "regex", name: "Regex" },
                    { id: "in_list", name: "In list" },
                  ]}
                  isRequired
                />
                <TextInput source="value" isRequired />
              </>
            );
          }}
        </FormDataConsumer>
      </SimpleFormIterator>
    </ArrayInput>
    <Typography variant="h6" gutterBottom>
      Post security
    </Typography>
    <SelectInput
      source="port_locking"
      resettable
      choices={[
        { id: "SWITCH", name: "Switch" },
        { id: "SWITCH_PORT", name: "Switch and port" },
      ]}
    />
    <Grid container spacing={4} columnSpacing={4} columns={16}>
      <Grid size={4}>
        <Typography variant="h6" gutterBottom>
          Replies
        </Typography>
      </Grid>
      <Grid size={12}>
        <AddVlanRepliesButton />
      </Grid>
    </Grid>

    <ArrayInput source="replies" label="">
      <SimpleFormIterator inline={true}>
        <TextInput source="attribute" isRequired />

        <SelectInput
          source="operator"
          choices={[
            { id: "=", name: "Equals" },
            { id: ":=", name: "Set equals" },
          ]}
          isRequired
        />

        <TextInput source="value" isRequired />
      </SimpleFormIterator>
    </ArrayInput>
  </SimpleForm>
);

export const PolicyEdit = () => (
  <Edit redirect="show" mutationMode="pessimistic">
    <PolicyCreateEdit />
  </Edit>
);

export const PolicyCreate = () => (
  <Create redirect="show">
    <PolicyCreateEdit />
  </Create>
);
