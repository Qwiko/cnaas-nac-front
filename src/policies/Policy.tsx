import { Button as MuiButton, Tooltip, Typography } from "@mui/material";
import { Grid } from "@mui/system";
import {
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
  useRecordContext,
  DeleteButton,
  EditButton,
  CloneButton,
  TopToolbar,
  DatagridConfigurable,
  DateField,
  SelectColumnsButton,
  FilterButton,
  CreateButton,
  ExportButton,
  useParams,
  LinkBase,
  Button,
  CanAccess,
} from "react-admin";
import RecentActorsIcon from "@mui/icons-material/RecentActors";

import AddIcon from "@mui/icons-material/Add";
import { useFormContext } from "react-hook-form";
import {
  ColoredBooleanField,
  ListBulkActions,
  NACDefaultPagination,
  NACPagination,
} from "../shared/Shared";

const PolicyFilters = [
  // eslint-disable-next-line react/jsx-key
  <TextInput label="Search" source="q" alwaysOn />,
  // eslint-disable-next-line react/jsx-key
  <SelectInput
    source="port_type"
    resettable
    choices={[
      { id: "Ethernet", name: "Wired only" },
      { id: "Wireless-802.11", name: "Wireless only" },
    ]}
  />,
  // eslint-disable-next-line react/jsx-key
  <SelectInput
    source="client_type"
    resettable
    choices={[
      { id: "MAB", name: "MAB only" },
      { id: "EAP", name: "EAP only" },
    ]}
  />,
  // eslint-disable-next-line react/jsx-key
  <SelectInput
    source="match_logic"
    isRequired
    choices={[
      { id: "AND", name: "AND" },
      { id: "OR", name: "OR" },
    ]}
  />,
  // eslint-disable-next-line react/jsx-key
  <SelectInput
    source="port_locking"
    resettable
    choices={[
      { id: "switch", name: "Switch" },
      { id: "switch_port", name: "Switch and port" },
    ]}
  />,
];

const PolicyListActions = () => (
  <TopToolbar>
    <SelectColumnsButton />
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const PolicyList = () => (
  <List
    filters={PolicyFilters}
    actions={<PolicyListActions />}
    pagination={<NACPagination />}
    perPage={NACDefaultPagination}
  >
    <DatagridConfigurable bulkActionButtons={<ListBulkActions />}>
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
          { id: "EAP", name: "EAP only" },
        ]}
      />
      <SelectField
        source="match_logic"
        choices={[
          { id: "AND", name: "AND" },
          { id: "OR", name: "OR" },
        ]}
      />
      <ColoredBooleanField source="enabled" />
      <DateField source="created_at" showTime={true} />
      <DateField source="updated_at" showTime={true} />
    </DatagridConfigurable>
  </List>
);

const PolicyShowActions = () => {
  const { id } = useParams();
  if (!id) return;

  return (
    <TopToolbar>
      <CanAccess action="list" resource="authentication">
        <Button
          component={LinkBase}
          to={{
            pathname: "/authentication",
            search: `filter=${JSON.stringify({ matched_policy_id__in: [id] })}`,
          }}
          startIcon={<RecentActorsIcon />}
          label="authentications"
        >
          <RecentActorsIcon />
        </Button>
      </CanAccess>
      <CloneButton />
      <EditButton />
      <DeleteButton mutationMode="pessimistic" />
    </TopToolbar>
  );
};

const PolicyShowConditionValue = () => {
  // const { selectedIds, onToggleItem } = useListContext();
  const record = useRecordContext();

  if (!record) return;

  if (record?.attribute == "group_id") {
    return <ReferenceField reference="endpoint_group" source="value" />;
  } else {
    return <TextField source="value" />;
  }
};

const AddVlanRepliesButton = () => {
  const { getValues, setValue } = useFormContext();
  return (
    <Tooltip title="Add necessary replies to set a VLAN id.">
      <MuiButton
        component="label"
        variant="contained"
        onClick={() => {
          const replies = getValues("replies");
          const newReplies = replies.concat([
            {
              attribute: "Tunnel-Medium-Type",
              value: "IEEE-802",
            },
            { attribute: "Tunnel-Type", value: "VLAN" },
            {
              attribute: "Tunnel-Private-Group-Id",
              value: "Insert vlan id here",
            },
          ]);
          setValue("replies", newReplies);
        }}
        startIcon={<AddIcon />}
      >
        Add VLAN replies
      </MuiButton>
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
          { id: "EAP", name: "EAP only" },
        ]}
      />
      <SelectField
        source="match_logic"
        choices={[
          { id: "AND", name: "AND" },
          { id: "OR", name: "OR" },
        ]}
      />

      <ColoredBooleanField source="enabled" />

      <ArrayField source="conditions" emptyText="Testing">
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
                { id: "realm", name: "Realm" },
                { id: "group_id", name: "Endpoint group" },
                { id: "ldap_groups", name: "LDAP group" },
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
      <Typography variant="h7" gutterBottom>
        Post security
      </Typography>
      <SelectField
        source="port_locking"
        choices={[
          { id: "SWITCH", name: "Switch" },
          { id: "SWITCH_PORT", name: "Switch and port" },
        ]}
        emptyText="Not used"
      />
      <ArrayField source="replies">
        <DataTable bulkActionButtons={false}>
          <DataTable.Col source="attribute">
            <TextField source="attribute" />
          </DataTable.Col>
          <DataTable.Col source="value">
            <PolicyShowConditionValue />
          </DataTable.Col>
        </DataTable>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);

const PolicyCreateEditTransform = (data) => ({
  ...data,
  port_type: data.port_type === "null" ? null : data.port_type,
  client_type: data.client_type === "null" ? null : data.client_type,
  port_locking: data.port_locking === "null" ? null : data.port_locking,
});

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
    <BooleanInput source="enabled" isRequired />
    <Typography variant="h6" gutterBottom>
      Pre filters
    </Typography>
    <Grid container spacing={4}>
      <Grid size={6}>
        <SelectInput
          source="port_type"
          resettable
          emptyText="Any"
          emptyValue="null"
          defaultValue="null"
          choices={[
            { id: "Ethernet", name: "Wired only" },
            { id: "Wireless-802.11", name: "Wireless only" },
          ]}
          format={(v) => (v == null ? "null" : v)}
        />
      </Grid>
      <Grid size={6}>
        <SelectInput
          source="client_type"
          resettable
          emptyText="Any"
          emptyValue="null"
          defaultValue="null"
          choices={[
            { id: "MAB", name: "MAB only" },
            { id: "EAP", name: "EAP only" },
          ]}
          format={(v) => (v == null ? "null" : v)}
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
      defaultValue={"AND"}
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
            { id: "realm", name: "Realm" },
            { id: "group_id", name: "Endpoint group" },
            { id: "ldap_groups", name: "LDAP group" },
          ]}
          isRequired
        />

        <FormDataConsumer<{ attribute: string }>>
          {({ scopedFormData }) => {
            if (scopedFormData?.attribute == "group_id") {
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
            } else if (scopedFormData?.attribute == "ldap_groups") {
              return (
                <>
                  <SelectInput
                    source="operator"
                    choices={[{ id: "in_list", name: "In list" }]}
                    isRequired
                  />
                  <TextInput source="value" isRequired />
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
      emptyText="Not used"
      emptyValue="null"
      defaultValue="null"
      choices={[
        { id: "SWITCH", name: "Switch" },
        { id: "SWITCH_PORT", name: "Switch and port" },
      ]}
      format={(v) => (v == null ? "null" : v)}
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
        <TextInput source="value" isRequired />
      </SimpleFormIterator>
    </ArrayInput>
  </SimpleForm>
);

export const PolicyEdit = () => (
  <Edit
    redirect="show"
    mutationMode="pessimistic"
    transform={PolicyCreateEditTransform}
  >
    <PolicyCreateEdit />
  </Edit>
);

export const PolicyCreate = () => (
  <Create redirect="show" transform={PolicyCreateEditTransform}>
    <PolicyCreateEdit />
  </Create>
);
