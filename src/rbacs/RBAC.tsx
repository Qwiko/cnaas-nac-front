import {
  ArrayInput,
  CheckboxGroupInput,
  Create,
  DatagridConfigurable,
  DataTable,
  Edit,
  List,
  NumberField,
  ReferenceArrayInput,
  SelectArrayInput,
  SelectInput,
  Show,
  SimpleForm,
  SimpleFormIterator,
  SimpleShowLayout,
  TextField,
  TextInput,
} from "react-admin";

export const RBACList = () => (
  <List pagination={false}>
    <DatagridConfigurable bulkActionButtons={false}>
      <TextField source="name" />
    </DatagridConfigurable>
  </List>
);

export const RBACShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="name" />
    </SimpleShowLayout>
  </Show>
);

export const RBACEdit = () => (
  <Edit redirect="show" mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="name" isRequired />
    </SimpleForm>
  </Edit>
);

export const RBACCreate = () => (
  <Create redirect="show" mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="name" isRequired />

      <ArrayInput source="permissions">
        <SimpleFormIterator inline={true}>
          <SelectInput
            source="resource"
            choices={[
              { id: "accounting", name: "Accounting" },
              { id: "authentication", name: "Authentication" },
              { id: "endpoint_group", name: "Endpoint group" },
              { id: "endpoint", name: "Endpoint" },
              { id: "nas_port", name: "Nas port" },
              { id: "policy", name: "Policy" },
              { id: "radius_client", name: "Radius client" },
              { id: "rbac", name: "RBAC" },
              { id: "vlan", name: "Vlan" },
            ]}
            isRequired
          />
          <CheckboxGroupInput
            source="methods"
            choices={[
              { id: "GET", name: "GET" },
              { id: "POST", name: "POST" },
              { id: "PUT", name: "PUT" },
              { id: "DELETE", name: "DELETE" },
            ]}
            isRequired
          />
        </SimpleFormIterator>
      </ArrayInput>
      <ReferenceArrayInput
        reference="endpoint_group"
        source="allowed_endpoint_groups"
        label="Group"
      />
    </SimpleForm>
  </Create>
);
