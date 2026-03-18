import {
  Button,
  Create,
  CreateButton,
  DatagridConfigurable,
  DateField,
  DeleteButton,
  Edit,
  EditButton,
  ExportButton,
  FilterButton,
  LinkBase,
  List,
  SelectColumnsButton,
  Show,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
  TopToolbar,
  useRecordContext,
} from "react-admin";
import {
  ListBulkActions,
  NACDefaultPagination,
  NACPagination,
} from "../shared/Shared";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import ListAltIcon from "@mui/icons-material/ListAlt";

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
      <TextField source="server" />
      <DateField source="created_at" showTime={true} />
      <DateField source="updated_at" showTime={true} />
    </DatagridConfigurable>
  </List>
);

const RadiusClientShowActions = () => {
  const record = useRecordContext();

  if (!record) return null;

  return (
    <TopToolbar>
      <Button
        component={LinkBase}
        to={{
          pathname: "/accounting",
          search: `filter=${JSON.stringify({ nas_ip_address__in: record?.network })}`,
        }}
        startIcon={<RecentActorsIcon />}
        label="accountings"
      >
        <ListAltIcon />
      </Button>
      <Button
        component={LinkBase}
        to={{
          pathname: "/authentication",
          search: `filter=${JSON.stringify({ nas_ip_address__in: record?.network })}`,
        }}
        startIcon={<RecentActorsIcon />}
        label="authentications"
      >
        <RecentActorsIcon />
      </Button>
      <EditButton />
      <DeleteButton mutationMode="pessimistic" />
    </TopToolbar>
  );
};

export const RadiusClientShow = () => (
  <Show actions={<RadiusClientShowActions />}>
    <SimpleShowLayout>
      <TextField source="name" />
      <TextField source="network" />
      <TextField source="description" />
      <TextField source="server" />
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
      <TextInput source="server" />
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
      <TextInput source="server" defaultValue={"default"} />
      <TextInput source="secret" isRequired />
    </SimpleForm>
  </Create>
);
