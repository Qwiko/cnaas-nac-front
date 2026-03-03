import { Link, Tooltip } from "@mui/material";
import {
  Create,
  DataTable,
  DateField,
  List,
  Show,
  SimpleShowLayout,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  ReferenceManyField,
  useRecordContext,
  ReferenceInput,
  ReferenceField,
  ReferenceArrayInput,
  SelectField,
  EditButton,
  DeleteButton,
  TopToolbar,
} from "react-admin";

const EndpointFilters = [
  <TextInput label="Search" source="q" alwaysOn />,
  <ReferenceArrayInput
    reference="endpoint_group"
    label="Group"
    source="group_id__in"
  />,
  <TextInput label="NAS Identifier" source="nas_identifier__like" />,
  <TextInput label="NAS Port" source="nas_port_id__like" />,
];

export const EndpointList = () => (
  <List filters={EndpointFilters}>
    <DataTable>
      <DataTable.Col source="username" />
      <DataTable.Col source="calling_station_id" />
      <DataTable.Col source="group_id">
        <ReferenceField
          reference="endpoint_group"
          source="group_id"
          label="Group"
        />
      </DataTable.Col>
      <DataTable.Col source="state">
        <SelectField
          source="state"
          choices={[
            { id: "discovered", name: "Discovered" },
            { id: "pending", name: "Pending" },
            { id: "rejected", name: "Rejected" },
            { id: "authorized", name: "Authorized" },
          ]}
        />
      </DataTable.Col>

      <DataTable.Col source="oui" />
      <DataTable.Col source="nas_identifier" label="Latest NAS Identifier" />
      <DataTable.Col source="nas_port_id" label="Latest NAS Port" />
    </DataTable>
  </List>
);

const EndPointShowAuthLogsPolicyLink = () => {
  const record = useRecordContext();

  if (!record) return null;

  return (
    <Tooltip title="Search for policy">
      <Link href={`#/policy?filter={"q"%3A"${record.matched_policy}"}`}>
        <TextField source="matched_policy" />
      </Link>
    </Tooltip>
  );
};

const EndpointShowRelations = () => {
  const record = useRecordContext();

  if (!record) return null;

  return (
    <>
      <SimpleShowLayout>
        <ReferenceManyField
          label="Ports"
          reference="nas_port"
          target="username"
          filter={{
            username: record.username,
            calling_station_id: record.calling_station_id,
          }}
          sort={{ field: "updated_at", order: "DESC" }}
          empty="No ports found"
        >
          <DataTable>
            <DataTable.Col source="nas_identifier" />
            <DataTable.Col source="nas_port_id" label="Port ID" />
            <DataTable.Col source="created_at" label="First seen">
              <DateField source="created_at" showTime={true} />
            </DataTable.Col>
            <DataTable.Col source="updated_at" label="Last seen">
              <DateField source="updated_at" showTime={true} />
            </DataTable.Col>
          </DataTable>
        </ReferenceManyField>
      </SimpleShowLayout>
      <SimpleShowLayout>
        <ReferenceManyField
          label="Sessions"
          reference="logs/accounting"
          target="username"
          filter={{
            username: record.username,
            calling_station_id: record.calling_station_id,
          }}
          sort={{ field: "acct_start_time", order: "DESC" }}
          empty="No accounting logs found"
        >
          <DataTable>
            <DataTable.Col source="nas_identifier" />
            <DataTable.Col source="nas_port_id" label="Port ID" />

            <DataTable.Col source="acct_start_time">
              <DateField source="acct_start_time" showTime={true} />
            </DataTable.Col>
            <DataTable.Col source="acct_stop_time">
              <DateField source="acct_stop_time" showTime={true} />
            </DataTable.Col>
          </DataTable>
        </ReferenceManyField>
      </SimpleShowLayout>
      <SimpleShowLayout>
        <ReferenceManyField
          label="Post Authentication logs"
          reference="logs/post_auth"
          target="username"
          filter={{
            username: record.username,
            calling_station_id: record.calling_station_id,
          }}
          sort={{ field: "auth_date", order: "DESC" }}
          empty="No post authentication logs found"
        >
          <DataTable>
            <DataTable.Col source="nas_identifier" />
            <DataTable.Col source="nas_port_id" label="Port ID" />
            <DataTable.Col source="auth_date">
              <DateField source="auth_date" showTime={true} />
            </DataTable.Col>
            <DataTable.Col source="reply" />
            <DataTable.Col source="matched_policy">
              <EndPointShowAuthLogsPolicyLink />
            </DataTable.Col>
            <DataTable.Col source="error_message" />
          </DataTable>
        </ReferenceManyField>
      </SimpleShowLayout>
    </>
  );
};

const EndpointShowActions = () => (
  <TopToolbar>
    <EditButton />
    <DeleteButton mutationMode="pessimistic" />
  </TopToolbar>
);

export const EndpointShow = () => (
  <Show actions={<EndpointShowActions />}>
    <SimpleShowLayout>
      <TextField source="username" />
      <TextField source="calling_station_id" />
      <TextField source="description" />
      <SelectField
        source="state"
        choices={[
          { id: "discovered", name: "Discovered" },
          { id: "pending", name: "Pending" },
          { id: "rejected", name: "Rejected" },
          { id: "authorized", name: "Authorized" },
        ]}
      />
      <ReferenceField reference="endpoint_group" source="group_id" />
      <TextField source="oui" />
      <TextField
        source="nas_identifier"
        label="Latest NAS Identifier"
        emptyText="None"
      />
      <TextField
        source="nas_port_id"
        label="Latest NAS Port"
        emptyText="None"
      />
      <DateField source="created_at" showTime={true} />
      <DateField source="updated_at" showTime={true} />
    </SimpleShowLayout>
    <EndpointShowRelations />
  </Show>
);

export const EndpointEdit = () => (
  <Edit redirect="show" mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="description" />
      <ReferenceInput reference="endpoint_group" source="group_id" />
    </SimpleForm>
  </Edit>
);

export const EndpointCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="username" />
      <TextInput source="description" />
      <ReferenceInput reference="endpoint_group" source="group_id" />
    </SimpleForm>
  </Create>
);
