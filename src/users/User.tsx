import {
  BooleanField,
  Create,
  DataTable,
  DateField,
  DateInput,
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
  ReferenceManyField,
} from "react-admin";

const UserFilters = [<TextInput label="Search" source="q" alwaysOn />];

export const UserList = () => (
  <List filters={UserFilters}>
    <DataTable>
      <DataTable.Col source="username" />
      <DataTable.Col source="enabled">
        <BooleanField source="enabled" />
      </DataTable.Col>
      <DataTable.NumberCol source="vlan" />
      <DataTable.Col source="access_start">
        <DateField source="access_start" />
      </DataTable.Col>
      <DataTable.Col source="access_stop">
        <DateField source="access_stop" />
      </DataTable.Col>
    </DataTable>
  </List>
);

export const UserShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="username" />
      <BooleanField source="enabled" />
      <NumberField source="vlan" />
      <TextField source="access_start" />
      <TextField source="access_stop" />
      <DateField source="created_at" showTime={true} />
      <DateField source="updated_at" showTime={true} />
    </SimpleShowLayout>
    <SimpleShowLayout>
      <ReferenceManyField
        label="Ports"
        reference="nas_port"
        target="username"
        sort={{ field: "updated_at", order: "DESC" }}
        empty="No ports found<"
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
        sort={{ field: "acct_start_time", order: "DESC" }}
        empty="No accounting logs found"
      >
        <DataTable>
          <DataTable.Col source="nas_identifier" />
          <DataTable.Col source="nas_port_id" label="Port ID" />

          <DataTable.Col source="acct_start_time">
            <DateField source="acct_start_time" showTime={true} />
          </DataTable.Col>
          <DataTable.Col source="acctstoptime">
            <DateField source="acctstoptime" showTime={true} />
          </DataTable.Col>
        </DataTable>
      </ReferenceManyField>
    </SimpleShowLayout>
    <SimpleShowLayout>
      <ReferenceManyField
        label="Post Authentication logs"
        reference="logs/post_auth"
        target="username"
        sort={{ field: "auth_date", order: "DESC" }}
        empty="No post authentication logs found"
      >
        <DataTable>
          <DataTable.Col source="nas_identifier" />
          <DataTable.Col source="nas_port_id" label="Port ID" />
          <DataTable.Col source="auth_date">
            <DateField source="auth_date" showTime={true} />
          </DataTable.Col>
          <DataTable.Col source="reply_message" />
        </DataTable>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);

export const UserEdit = () => (
  <Edit redirect="show" mutationMode="pessimistic">
    <SimpleForm>
      <BooleanInput source="enabled" />
      <NumberInput source="vlan" />
      <DateInput source="access_start" />
      <DateInput source="access_stop" />
    </SimpleForm>
  </Edit>
);

export const UserCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="username" />
      <BooleanInput source="enabled" />
      <NumberInput source="vlan" />
      <DateInput source="access_start" />
      <DateInput source="access_stop" />
    </SimpleForm>
  </Create>
);
