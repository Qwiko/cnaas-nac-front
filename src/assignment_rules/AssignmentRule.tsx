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
  ArrayField,
  ChipField,
  SingleFieldList,
  ArrayInput,
  SimpleFormIterator,
} from "react-admin";

const AssignmentRuleFilters = [
  <TextInput label="Search" source="q" alwaysOn />,
];

export const AssignmentRuleList = () => (
  <List filters={AssignmentRuleFilters}>
    <DataTable>
      <DataTable.Col source="name" />
      <DataTable.NumberCol source="priority" />
      <DataTable.NumberCol source="target_vlan" />
      <DataTable.Col source="match_logic" />
      <DataTable.Col source="reevaluate_existing">
        <BooleanField source="reevaluate_existing" />
      </DataTable.Col>
      <DataTable.Col source="is_active">
        <BooleanField source="is_active" />
      </DataTable.Col>
      <DataTable.Col source="conditions">
        <ArrayField source="conditions">
          <SingleFieldList>
            <ChipField source="attribute" />
          </SingleFieldList>
        </ArrayField>
      </DataTable.Col>
      <DataTable.Col source="id" />
    </DataTable>
  </List>
);

export const AssignmentRuleShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="name" />
      <NumberField source="priority" />
      <NumberField source="target_vlan" />
      <TextField source="match_logic" />
      <BooleanField source="reevaluate_existing" />
      <BooleanField source="is_active" />
      <ArrayField source="conditions">
        <DataTable>
          <DataTable.Col source="attribute">
            <TextField source="attribute" />
          </DataTable.Col>
          <DataTable.Col source="operator">
            <TextField source="operator" />
          </DataTable.Col>
          <DataTable.Col source="target_value">
            <TextField source="target_value" />
          </DataTable.Col>
        </DataTable>
      </ArrayField>
      <TextField source="id" />
    </SimpleShowLayout>
  </Show>
);

export const AssignmentRuleEdit = () => (
  <Edit redirect="show" mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="name" />
      <NumberInput source="priority" />
      <NumberInput source="target_vlan" />
      <TextInput source="match_logic" />
      <BooleanInput source="reevaluate_existing" />
      <BooleanInput source="is_active" />
      <ArrayInput source="conditions">
        <SimpleFormIterator>
          <TextInput source="attribute" />
          <TextInput source="operator" />
          <TextInput source="target_value" />
        </SimpleFormIterator>
      </ArrayInput>
      <TextInput source="id" />
    </SimpleForm>
  </Edit>
);

export const AssignmentRuleCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="AssignmentRulename" />
      <BooleanInput source="enabled" />
      <NumberInput source="vlan" />
      <DateInput source="access_start" />
      <DateInput source="access_stop" />
    </SimpleForm>
  </Create>
);
