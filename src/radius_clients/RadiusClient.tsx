import {
  Create,
  CreateButton,
  DatagridConfigurable,
  DataTable,
  DateField,
  DeleteButton,
  Edit,
  EditButton,
  ExportButton,
  FilterButton,
  List,
  ReferenceManyField,
  SelectColumnsButton,
  SelectField,
  Show,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
  TopToolbar,
} from "react-admin";
import {
  ListBulkActions,
  NACDefaultPagination,
  NACPagination,
} from "../shared/Shared";

// eslint-disable-next-line react/jsx-key
const RadiusClientFilters = [<TextInput label="Search" source="q" alwaysOn />];

const RadiusClientListActions = () => (
  <TopToolbar>
    <SelectColumnsButton />
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const RadiusClientList = () => (
  <List
    filters={RadiusClientFilters}
    actions={<RadiusClientListActions />}
    pagination={<NACPagination />}
    perPage={NACDefaultPagination}
  >
    <DatagridConfigurable bulkActionButtons={<ListBulkActions />}>
      <TextField source="name" />
      <TextField source="network" />
      <TextField source="description" />
      <DateField source="created_at" showTime={true} />
      <DateField source="updated_at" showTime={true} />
    </DatagridConfigurable>
  </List>
);

const RadiusClientShowActions = () => (
  <TopToolbar>
    <EditButton />
    <DeleteButton mutationMode="pessimistic" />
  </TopToolbar>
);

export const RadiusClientShow = () => (
  <Show actions={<RadiusClientShowActions />}>
    <SimpleShowLayout>
      <TextField source="name" />
      <TextField source="network" />
      <TextField source="description" />
      <TextField source="secret" />
    </SimpleShowLayout>
  </Show>
);

export const RadiusClientEdit = () => (
  <Edit redirect="show" mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="name" isRequired />
      <TextInput source="network" isRequired />
      <TextInput source="description" />
      <TextInput source="secret" isRequired />
    </SimpleForm>
  </Edit>
);

export const RadiusClientCreate = () => (
  <Create redirect="show" mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="name" isRequired />
      <TextInput source="network" isRequired />
      <TextInput source="description" />
      <TextInput source="secret" isRequired />
    </SimpleForm>
  </Create>
);
