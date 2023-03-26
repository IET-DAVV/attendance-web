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
}) => {
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
              student.attendance?.[getToday12AMDatetime()] === "Absent"
                ? "red"
                : student.attendance?.[getToday12AMDatetime()] === "Present"
                ? "green"
                : ""
            }
          >
            {student.attendance?.[getToday12AMDatetime()]}
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
    />
  );
};

export default ListView;
