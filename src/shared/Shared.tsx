import {
  BooleanField,
  BulkDeleteButton,
  BooleanFieldProps,
  useRecordContext,
} from "react-admin";

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
