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
  SelectArrayInput,
  FunctionField,
  SelectColumnsButton,
  FilterButton,
  CreateButton,
  ExportButton,
  DatagridConfigurable,
  useResourceContext,
  useGetRecordId,
  useGetOne,
  Loading,
} from "react-admin";
import {
  formatOctets,
  formatSeconds,
  ListBulkActions,
  NACDefaultPagination,
  NACPagination,
} from "../shared/Shared";

const EndpointFilters = [
  // eslint-disable-next-line react/jsx-key
  <TextInput label="Search" source="q" alwaysOn />,
  // eslint-disable-next-line react/jsx-key
  <ReferenceArrayInput
    reference="endpoint_group"
    label="Group"
    source="group_id__in"
  />,
  // eslint-disable-next-line react/jsx-key
  <SelectArrayInput
    source="state__in"
    label="State"
    choices={[
      { id: "discovered", name: "Discovered" },
      { id: "pending", name: "Pending" },
      { id: "rejected", name: "Rejected" },
      { id: "authorized", name: "Authorized" },
    ]}
  />,
  // eslint-disable-next-line react/jsx-key
  <TextInput label="NAS Identifier" source="nas_identifier__like" />,
  // eslint-disable-next-line react/jsx-key
  <TextInput label="NAS Port" source="nas_port_id__like" />,
];

const EndpointListActions = () => (
  <TopToolbar>
    <SelectColumnsButton />
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const EndpointList = () => (
  <List
    filters={EndpointFilters}
    actions={<EndpointListActions />}
    pagination={<NACPagination />}
    perPage={NACDefaultPagination}
  >
    <DatagridConfigurable bulkActionButtons={<ListBulkActions />}>
      <TextField source="username" />
      <TextField source="calling_station_id" />
      <ReferenceField
        reference="endpoint_group"
        source="group_id"
        label="Group"
      />
      <SelectField
        source="state"
        choices={[
          { id: "discovered", name: "Discovered" },
          { id: "pending", name: "Pending" },
          { id: "rejected", name: "Rejected" },
          { id: "authorized", name: "Authorized" },
        ]}
      />
      <TextField source="oui" />
      <TextField source="nas_identifier" label="Latest NAS Identifier" />
      <TextField source="nas_port_id" label="Latest NAS Port" />
      <DateField source="created_at" showTime={true} />
      <DateField source="updated_at" showTime={true} />
    </DatagridConfigurable>
  </List>
);

const AccountingExpand = () => {
  const recordId = useGetRecordId();

  const resource = useResourceContext();

  const { data, isPending } = useGetOne(resource, { id: recordId });

  if (isPending) {
    return <Loading loadingSecondary="" />;
  }
  const record = data;

  return (
    <>
      <SimpleShowLayout record={record} direction={"row"}>
        <TextField source="nas_identifier" />
        <TextField source="nas_port_id" />
      </SimpleShowLayout>
      <SimpleShowLayout record={record} direction={"row"}>
        <DateField
          source="acct_start_time"
          showTime={true}
          label="Start time"
        />
        <DateField
          source="acct_update_time"
          showTime={true}
          label="Update time"
          emptyText="N/A"
        />
        <DateField
          source="acct_stop_time"
          showTime={true}
          label="Stop time"
          emptyText="N/A"
        />
      </SimpleShowLayout>
      <SimpleShowLayout record={record} direction={"row"}>
        <FunctionField
          label="Session time"
          emptyText="N/A"
          render={(record) => formatSeconds(record?.acct_session_time)}
        />
        <FunctionField
          label="Input data"
          render={(record) => formatOctets(record?.acct_input_octets)}
        />
        <FunctionField
          label="Output data"
          render={(record) => formatOctets(record?.acct_output_octets)}
        />
      </SimpleShowLayout>
      <SimpleShowLayout record={record} direction={"row"}>
        <TextField source="framed_ip_address" />
        <TextField source="framed_ipv6_address" />
        <TextField source="framed_ipv6_prefix" />
        <TextField source="framed_interface_id" />
        <TextField source="delegated_ipv6_prefix" />
      </SimpleShowLayout>
    </>
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
          <DataTable bulkActionButtons={<ListBulkActions />}>
            <DataTable.Col source="nas_identifier" />
            <DataTable.Col source="nas_port_id" />
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
          label="Accounting"
          reference="accounting"
          target="username"
          filter={{
            username: record.username,
            calling_station_id: record.calling_station_id,
          }}
          sort={{ field: "acct_start_time", order: "DESC" }}
          empty="No accounting logs found"
        >
          <DataTable bulkActionButtons={false} expand={<AccountingExpand />}>
            <DataTable.Col source="nas_identifier" />
            <DataTable.Col source="nas_port_id" />

            <DataTable.Col source="acct_start_time" label="Start time">
              <DateField source="acct_start_time" showTime={true} />
            </DataTable.Col>
            <DataTable.Col source="acct_stop_time" label="Stop time">
              <DateField
                source="acct_stop_time"
                showTime={true}
                emptyText="N/A"
              />
            </DataTable.Col>
            <DataTable.Col source="acct_session_time" label="Session time">
              <FunctionField
                render={(record) => formatSeconds(record?.acct_session_time)}
              />
            </DataTable.Col>
            <DataTable.Col source="acct_input_octets" label="Input data">
              <FunctionField
                render={(record) => formatOctets(record?.acct_input_octets)}
              />
            </DataTable.Col>
            <DataTable.Col source="acct_output_octets" label="Output data">
              <FunctionField
                render={(record) => formatOctets(record?.acct_output_octets)}
              />
            </DataTable.Col>
          </DataTable>
        </ReferenceManyField>
      </SimpleShowLayout>
      <SimpleShowLayout>
        <ReferenceManyField
          label="Authentications"
          reference="authentication"
          target="username"
          filter={{
            username: record.username,
            calling_station_id: record.calling_station_id,
          }}
          sort={{ field: "auth_date", order: "DESC" }}
          empty="No authentication logs found"
        >
          <DataTable bulkActionButtons={false}>
            <DataTable.Col source="nas_identifier" />
            <DataTable.Col source="nas_port_id" label="Port ID" />
            <DataTable.Col source="auth_date">
              <DateField source="auth_date" showTime={true} />
            </DataTable.Col>
            <DataTable.Col source="reply" />
            <DataTable.Col source="matched_policy_id">
              <ReferenceField reference="policy" source="matched_policy_id" />
            </DataTable.Col>
            <DataTable.Col source="error_message" />
          </DataTable>
        </ReferenceManyField>
      </SimpleShowLayout>
    </>
  );
};

const isMacAddress = (address: string): boolean => {
  const regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return regex.test(address);
};

const EndpointShowTitle = () => {
  const record = useRecordContext();

  if (!record) return null;

  if (isMacAddress(record?.username))
    return <span>Endpoint: {record?.username}</span>;

  return (
    <span>
      Endpoint: {record?.username} ({record?.calling_station_id})
    </span>
  );
};

const EndpointShowActions = () => (
  <TopToolbar>
    <EditButton />
    <DeleteButton mutationMode="pessimistic" />
  </TopToolbar>
);

export const EndpointShow = () => (
  <Show actions={<EndpointShowActions />} title={<EndpointShowTitle />}>
    <SimpleShowLayout direction={"row"}>
      <TextField source="username" />
      <TextField source="calling_station_id" />
      <TextField source="description" />
      <ReferenceField
        reference="endpoint_group"
        source="group_id"
        empty="None"
      />
    </SimpleShowLayout>
    <SimpleShowLayout direction={"row"}>
      <SelectField
        source="state"
        choices={[
          { id: "discovered", name: "Discovered" },
          { id: "pending", name: "Pending" },
          { id: "rejected", name: "Rejected" },
          { id: "authorized", name: "Authorized" },
        ]}
      />
      <TextField source="oui" />
    </SimpleShowLayout>
    <SimpleShowLayout direction={"row"}>
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
    </SimpleShowLayout>
    <SimpleShowLayout direction={"row"}>
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
