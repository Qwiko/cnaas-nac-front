import {
  DatagridConfigurable,
  DateField,
  DateTimeInput,
  ExportButton,
  FilterButton,
  FunctionField,
  List,
  ReferenceArrayInput,
  ReferenceField,
  SelectArrayInput,
  SelectColumnsButton,
  SelectInput,
  Show,
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

const AuthenticationFilters = [
  // eslint-disable-next-line react/jsx-key
  <TextInput label="Search" source="q" alwaysOn />,
  // eslint-disable-next-line react/jsx-key
  <TextInput label="Username" source="username__ilike" />,
  // eslint-disable-next-line react/jsx-key
  <TextInput label="Calling Station" source="calling_station_id__ilike" />,
  // eslint-disable-next-line react/jsx-key
  <ReferenceArrayInput
    reference="policy"
    source="matched_policy_id__in"
    label="Policies"
  >
    <SelectArrayInput optionText="name" label="Policy" />
  </ReferenceArrayInput>,
  // eslint-disable-next-line react/jsx-key
  <TextInput label="NAS Identifier" source="nas_identifier__like" />,
  // eslint-disable-next-line react/jsx-key
  <TextInput label="NAS Port" source="nas_port_id__like" />,
  // eslint-disable-next-line react/jsx-key
  <SelectInput
    label="Reply"
    choices={[
      { id: "Access-Accept", name: "Accepted" },
      { id: "Access-Reject", name: "Rejected" },
    ]}
    source="reply"
    resettable
  />,
  // eslint-disable-next-line react/jsx-key
  <DateTimeInput label="Auth date gte" source="auth_date__gte" />,
  // eslint-disable-next-line react/jsx-key
  <DateTimeInput label="Auth date lte" source="auth_date__lte" />,
  // eslint-disable-next-line react/jsx-key
  <TextInput label="NAS IP Address In" source="nas_ip_address__in" />,
];

const AuthenticationListActions = () => (
  <TopToolbar>
    <SelectColumnsButton />
    <FilterButton />
    <ExportButton />
  </TopToolbar>
);

export const AuthenticationList = () => (
  <List
    filters={AuthenticationFilters}
    actions={<AuthenticationListActions />}
    sort={{ field: "auth_date", order: "DESC" }}
    pagination={<NACPagination />}
    perPage={NACDefaultPagination}
  >
    <DatagridConfigurable bulkActionButtons={<ListBulkActions />}>
      <TextField source="username" />
      <TextField source="calling_station_id" />

      <TextField source="nas_identifier" />
      <TextField source="nas_port_id" />

      <DateField source="auth_date" showTime={true} />
      <TextField source="reply" />
      <ReferenceField reference="policy" source="matched_policy_id" />
      <TextField source="error_message" />
    </DatagridConfigurable>
  </List>
);

export const AuthenticationShow = () => (
  <Show actions={false}>
    <SimpleShowLayout direction={"row"}>
      <FunctionField
        source="username"
        label="Username"
        render={(record) =>
          record.endpoint_id ? (
            <ReferenceField reference="endpoint" source="endpoint_id">
              <TextField source="username" />
            </ReferenceField>
          ) : (
            <TextField source="username" />
          )
        }
      />
      <TextField source="calling_station_id" />
    </SimpleShowLayout>
    <SimpleShowLayout direction={"row"}>
      <TextField source="nas_identifier" />
      <TextField source="nas_port_id" />
    </SimpleShowLayout>
    <SimpleShowLayout direction={"row"}>
      <DateField source="auth_date" showTime={true} />
      <TextField source="reply" />
    </SimpleShowLayout>
    <SimpleShowLayout direction={"row"}>
      <ReferenceField reference="policy" source="matched_policy_id" />
      <TextField source="error_message" />
    </SimpleShowLayout>
  </Show>
);
