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
import { ListBulkActions } from "../shared/Shared";

// eslint-disable-next-line react/jsx-key
const EndpointGroupFilters = [<TextInput label="Search" source="q" alwaysOn />];

const EndpointGroupListActions = () => (
  <TopToolbar>
    <SelectColumnsButton />
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const EndpointGroupList = () => (
  <List filters={EndpointGroupFilters} actions={<EndpointGroupListActions />}>
    <DatagridConfigurable bulkActionButtons={<ListBulkActions />}>
      <TextField source="name" />
      <DateField source="created_at" showTime={true} />
      <DateField source="updated_at" showTime={true} />
    </DatagridConfigurable>
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
        </DataTable>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);

export const EndpointGroupEdit = () => (
  <Edit redirect="show" mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="name" isRequired />
    </SimpleForm>
  </Edit>
);

export const EndpointGroupCreate = () => (
  <Create redirect="show" mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="name" isRequired />
    </SimpleForm>
  </Create>
);
