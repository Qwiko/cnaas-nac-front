import {
  BooleanField,
  BulkDeleteButton,
  BooleanFieldProps,
  useRecordContext,
  Pagination,
} from "react-admin";

export const isMacAddress = (address: string): boolean => {
  const regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return regex.test(address);
};

export const NACDefaultPagination = 50;

export const NACPagination = () => (
  <Pagination rowsPerPageOptions={[50, 100, 250, 500, 1000]} />
);

export const ColoredBooleanField = (props: BooleanFieldProps) => {
  const record = useRecordContext();
  // if (!record) return;
  return (
    <BooleanField
      {...props}
      sx={{ color: record[props.source] === true ? "green" : "red" }}
    />
  );
};

export const ListBulkActions = () => (
  <>
    <BulkDeleteButton mutationMode="pessimistic" />
  </>
);

export const formatSeconds = (totalSeconds?: number): string | undefined => {
  if (!totalSeconds) return;

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    days > 0 && `${days}d`,
    hours > 0 && `${hours}h`,
    minutes > 0 && `${minutes}m`,
    seconds > 0 && `${seconds}s`,
  ]
    .filter(Boolean)
    .join(" ");
};

export const formatOctets = (
  bytes?: number,
  decimals = 2,
): string | undefined => {
  if (!bytes || bytes === 0) return;

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];

  // Calculate which index of 'sizes' to use
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
