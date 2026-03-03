import {
  Create,
  DataTable,
  DeleteButton,
  Edit,
  EditButton,
  List,
  NumberField,
  ReferenceManyField,
  Show,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
  TopToolbar,
} from "react-admin";

const EndpointGroupFilters = [<TextInput label="Search" source="q" alwaysOn />];

export const EndpointGroupList = () => (
  <List filters={EndpointGroupFilters}>
    <DataTable>
      <DataTable.Col source="name" />
    </DataTable>
  </List>
);

const EndpointGroupShowActions = () => (
  <TopToolbar>
    <EditButton />
    <DeleteButton mutationMode="pessimistic" />
  </TopToolbar>
);

export const EndpointGroupShow = () => (
  <Show actions={<EndpointGroupShowActions />}>
    <SimpleShowLayout>
      <TextField source="name" />
      <ReferenceManyField
        label="Endpoints"
        reference="endpoint"
        target="group_id"
      >
        <DataTable bulkActionButtons={false}>
          <DataTable.Col source="username" />
          <DataTable.Col source="calling_station_id" />
          <DataTable.Col source="state" />
          <DataTable.Col source="oui" />
        </DataTable>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);

export const EndpointGroupEdit = () => (
  <Edit redirect="show" mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="name" />
    </SimpleForm>
  </Edit>
);

export const EndpointGroupCreate = () => (
  <Create redirect="show" mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="name" />
    </SimpleForm>
  </Create>
);
