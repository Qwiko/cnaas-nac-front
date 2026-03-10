import {
  BooleanInput,
  DatagridConfigurable,
  DateField,
  ExportButton,
  FilterButton,
  FunctionField,
  List,
  SelectColumnsButton,
  Show,
  SimpleShowLayout,
  TextField,
  TextInput,
  TopToolbar,
} from "react-admin";
import {
  formatOctets,
  formatSeconds,
  ListBulkActions,
  NACDefaultPagination,
  NACPagination,
} from "../shared/Shared";

const AccountingFilters = [
  // eslint-disable-next-line react/jsx-key
  <TextInput label="Search" source="q" alwaysOn />,
  // eslint-disable-next-line react/jsx-key
  <TextInput label="Username" source="username__ilike" />,
  // eslint-disable-next-line react/jsx-key
  <TextInput label="Calling Station" source="calling_station_id__ilike" />,
  // eslint-disable-next-line react/jsx-key
  <TextInput label="NAS Identifier" source="nas_identifier__ilike" />,
  // eslint-disable-next-line react/jsx-key
  <TextInput label="NAS Port" source="nas_port_id__ilike" />,
  // eslint-disable-next-line react/jsx-key
  <BooleanInput label="Active sessions" source="acct_stop_time__isnull" />,
];

const AccountingListActions = () => (
  <TopToolbar>
    <SelectColumnsButton />
    <FilterButton />
    <ExportButton />
  </TopToolbar>
);

export const AccountingList = () => (
  <List
    filters={AccountingFilters}
    actions={<AccountingListActions />}
    sort={{ field: "acct_start_time", order: "DESC" }}
    pagination={<NACPagination />}
    perPage={NACDefaultPagination}
  >
    <DatagridConfigurable bulkActionButtons={<ListBulkActions />}>
      <TextField source="username" />
      <TextField source="calling_station_id" />

      <TextField source="nas_identifier" />
      <TextField source="nas_port_id" />

      <DateField source="acct_start_time" showTime={true} label="Start time" />
      <DateField
        source="acct_stop_time"
        showTime={true}
        label="Stop time"
        emptyText="N/A"
      />
    </DatagridConfigurable>
  </List>
);

export const AccountingShow = () => (
  <Show actions={false}>
    <SimpleShowLayout direction={"row"}>
      <TextField source="username" />
      <TextField source="calling_station_id" />
    </SimpleShowLayout>
    <SimpleShowLayout direction={"row"}>
      <TextField source="nas_identifier" />
      <TextField source="nas_port_id" />
    </SimpleShowLayout>
    <SimpleShowLayout direction={"row"}>
      <DateField source="acct_start_time" showTime={true} label="Start time" />
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
    <SimpleShowLayout direction={"row"}>
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
    <SimpleShowLayout direction={"row"}>
      <TextField source="framed_ip_address" />
      <TextField source="framed_ipv6_address" />
      <TextField source="framed_ipv6_prefix" />
      <TextField source="framed_interface_id" />
      <TextField source="delegated_ipv6_prefix" />
    </SimpleShowLayout>
  </Show>
);
