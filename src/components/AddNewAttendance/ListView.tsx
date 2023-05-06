import { getToday12AMDatetime } from "@/utils/functions";
import { IStudentAttendance } from "@/utils/interfaces";
import { Table, Tag } from "antd";

const rowSelection = {
  onChange: (
    selectedRowKeys: React.Key[],
    selectedRows: IStudentAttendance[]
  ) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: (record: IStudentAttendance) => ({
    disabled: record.name === "Disabled User", // Column configuration not to be checked
    name: record.name,
  }),
};

interface Props {
  currentStudentAtteandanceStatus: () =>
    | "Absent"
    | "Present"
    | "NA"
    | undefined;
  today: {
    day: string;
    date: number;
    month: string;
  };
  students: IStudentAttendance[];
  date?: Date;
  handleClickAbsent: (student: IStudentAttendance) => void;
  handleClickPresent: (student: IStudentAttendance) => void;
  handleClickSelectAll: (status: "Present" | "Absent") => void;
}

const ListView: React.FC<Props> = ({
  today,
  students,
  handleClickAbsent,
  handleClickPresent,
  handleClickSelectAll,
  date,
}) => {
  const today12AMDateTime = getToday12AMDatetime(date);

  const columns: any = [
    {
      title: "Roll No",
      dataIndex: "rollID",
      key: "rollID",
      fixed: "left",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Attendance",
      dataIndex: "attendance",
      key: "attendance",
      fixed: "right",
      render: (_: any, student: IStudentAttendance) => {
        return (
          <Tag
            style={{ marginTop: "0.5rem" }}
            color={
              student.attendance?.[today12AMDateTime] === "Absent"
                ? "red"
                : student.attendance?.[today12AMDateTime] === "Present"
                ? "green"
                : ""
            }
          >
            {student.attendance?.[today12AMDateTime]}
          </Tag>
        );
      },
    },
  ];

  return (
    <Table
      rowSelection={{
        type: "checkbox",
        ...rowSelection,
        // onChange: (
        //   selectedRowKeys: React.Key[],
        //   selectedRows: IStudentAttendance[]
        // ) => {
        //   selectedRows.forEach((student) => {
        //     handleClickPresent(student);
        //   });
        // },
        onSelect: (record: IStudentAttendance, selected: boolean) => {
          if (selected) {
            handleClickPresent(record);
          } else {
            handleClickAbsent(record);
          }
        },
        onSelectAll(
          selected: boolean,
          selectedRows: IStudentAttendance[],
          changeRows: any
        ) {
          handleClickSelectAll(selected ? "Present" : "Absent");
        },
      }}
      columns={columns}
      dataSource={students}
      scroll={{
        y: "calc(100vh - 380px)",
      }}
      pagination={{
        defaultPageSize: 20,
      }}
    />
  );
};

export default ListView;
