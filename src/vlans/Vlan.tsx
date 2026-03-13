import {
  DataTable,
  List,
  NumberField,
  Show,
  SimpleShowLayout,
  TextField,
} from "react-admin";

export const VlanList = () => (
  <List pagination={false}>
    <DataTable bulkActionButtons={false}>
      <DataTable.Col source="vlan" />
      <DataTable.Col source="name" />
    </DataTable>
  </List>
);

export const VlanShow = () => (
  <Show>
    <SimpleShowLayout>
      <NumberField source="vlan" />
      <TextField source="name" />
    </SimpleShowLayout>
  </Show>
);
