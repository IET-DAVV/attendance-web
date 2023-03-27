import Head from "next/head";
import { createRef, useCallback, useEffect, useRef, useState } from "react";
import { attendanceServices, studentServices } from "@/utils/api/services";
import {
  getCurrentWeekDates,
  getDateDayMonthYear,
  getToday12AMDatetime,
  getTotalDaysCountInCurrentMonth,
} from "@/utils/functions";
import styles from "../styles/main.module.scss";
import {
  Button,
  DatePicker,
  Dropdown,
  MenuProps,
  Pagination,
  Select,
  Table,
  Tag,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PlusOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import AddNewAttendance from "@/components/AddNewAttendance/AddNewAttendance";
import dayjs from "dayjs";
import { useGlobalContext } from "@/utils/context/GlobalContext";
import { CSVDownload, CSVLink } from "react-csv";
const { RangePicker } = DatePicker;

// items arr for exporting and marking attendance
const actionMenuItems = [
  {
    key: "1",
    label: "Export CSV",
    icon: <FileExcelOutlined />,
  },
  {
    key: "2",
    label: "Export PDF",
    icon: <FilePdfOutlined />,
  },
  {
    key: "3",
    label: "Edit Attendance",
    icon: <EditOutlined />,
  },
  {
    key: "4",
    label: "Detain Students",
    icon: <UserDeleteOutlined />,
  },
];

const academicYear = "2021-2022";
const classId = "2021_CS_A";
export default function Home() {
  const [attendance, setAttendance] = useState([]);
  const [detainedStudents, setDetainedStudents] = useState([]);
  const [currentWeekAttendance, setCurrentWeekAttendance] = useState({});
  const [newAttendanceDrawer, setNewAttendanceDrawer] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [editAttendanceMode, setEditAttendanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentDateRange, setCurrentDateRange] = useState<any>([
    dayjs(getCurrentWeekDates()[0]),
    dayjs(getCurrentWeekDates()[6]),
  ]);

  const [columns, setColumns] = useState([]);
  const { studentsAttendance, setStudentsAttendance, currentClassInfo } =
    useGlobalContext();

  const csvBtnRef = useRef<
    CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }
  >(null);

  const getCurrentDateRangeAttendance = useCallback(async () => {
    setLoading(true);
    const { data } = await attendanceServices.getStudentsAttendanceInDateRange(
      academicYear,
      {
        startDate: currentDateRange[0].toDate().getTime(),
        endDate: currentDateRange[1].toDate().getTime(),
      },
      currentClassInfo.subjectCode,
      classId
    );
    setCurrentWeekAttendance(data.data);
    setLoading(false);
  }, [currentDateRange, currentClassInfo.subjectCode]);

  useEffect(() => {
    if (currentDateRange.length && currentClassInfo.subjectCode) {
      getCurrentDateRangeAttendance();
    }
  }, [
    currentDateRange,
    currentClassInfo.subjectCode,
    getCurrentDateRangeAttendance,
  ]);

  async function markAttendanceMultiple() {
    const todayTime = getToday12AMDatetime().toString();
    const absentStudents = studentsAttendance?.filter(
      (student: any) => (student.attendance[todayTime] = "Absent")
    );
    const presentStudents = studentsAttendance?.filter(
      (student: any) => (student.attendance[todayTime] = "Present")
    );
    await attendanceServices.markStudentAttendanceMultiple(
      academicYear,
      currentClassInfo.subjectCode,
      todayTime,
      absentStudents?.map((student: any) => student.enrollmentID),
      "absent",
      "classID" //provide classID here
    );
    await attendanceServices.markStudentAttendanceMultiple(
      academicYear,
      currentClassInfo.subjectCode,
      todayTime,
      presentStudents?.map((student: any) => student.enrollmentID),
      "present",
      "classID" //provide classID here
    );
  }

  useEffect(() => {
    let prevColumns = [
      {
        title: "Roll No.",
        dataIndex: "rollID",
        key: "rollID",
      },
      {
        title: "Enroll No.",
        dataIndex: "enrollmentID",
        key: "enrollmentID",
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text: string) => (
          <span
            style={{
              textTransform: "capitalize",
            }}
          >
            {text.toLowerCase()}
          </span>
        ),
      },
    ];
    let newColumns = getNewColumnsForCurrentWeek(prevColumns);
    setColumns(newColumns);
  }, []);

  useEffect(() => {
    if (Object.values(currentWeekAttendance)?.length) {
      setStudentsAttendance((prev: any) =>
        prev.map((student: any) =>
          studentAttendanceStatus(currentWeekAttendance, student)
        )
      );
    }
  }, [currentWeekAttendance]);

  const onMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "1") {
      if (csvBtnRef.current) csvBtnRef?.current?.link?.click();
    }
    if (e.key === "3") {
      setEditAttendanceMode(true);
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRowsNew: any[]) => {
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   "selectedRows: ",
      //   selectedRows
      // );
      setSelectedRows(selectedRowsNew);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };

  async function submitAttendance() {
    await markAttendanceMultiple();
    setNewAttendanceDrawer(false);
  }

  useEffect(() => {
    if (studentsAttendance?.length) {
      console.log(studentsAttendance);
    }
  }, [studentsAttendance]);

  return (
    <>
      <Head>
        <title>IET Attendance</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout className={styles.main}>
        <div className={styles.flexRow}>
          <h3>IET Attendance</h3>
          <div className={styles.actionBtns}>
            <div>
              <Tooltip
                title={
                  selectedRows?.length
                    ? "Actions For Students"
                    : "Select Students to enable Actions"
                }
              >
                <Dropdown.Button
                  disabled={!selectedRows?.length}
                  menu={{ items: actionMenuItems, onClick: onMenuClick }}
                >
                  Actions
                </Dropdown.Button>
              </Tooltip>
            </div>
            <div className={styles.datePicker}>
              <RangePicker
                format={"DD/MM/YYYY"}
                defaultValue={[
                  dayjs(getCurrentWeekDates()[0]),
                  dayjs(getCurrentWeekDates()[6]),
                ]}
                onChange={(dates) => {
                  setCurrentDateRange(dates);
                }}
                value={currentDateRange}
              />
            </div>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => setNewAttendanceDrawer(true)}
            >
              New Attendance
            </Button>
          </div>
        </div>
        <div className={styles.tableContainer}>
          <Table
            bordered
            loading={loading}
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}
            columns={columns}
            dataSource={studentsAttendance}
            scroll={{
              x: 1000,
              y: 500,
            }}
          />
        </div>
        <CSVDownload
          ref={csvBtnRef}
          data={studentsAttendance}
          filename={`attendance-${currentClassInfo.subjectCode}-${currentClassInfo.section}.csv`}
        />
        <AddNewAttendance
          open={newAttendanceDrawer}
          onClose={() => setNewAttendanceDrawer(false)}
        />
      </MainLayout>
    </>
  );
}

function getNewColumnsForCurrentWeek(prevColumns: Array<any>) {
  let newColumns: any = [
    ...prevColumns,
    ...getCurrentWeekDates().map((date) => {
      let ddmy = getDateDayMonthYear(date.getTime());
      let today = new Date().setHours(0, 0, 0, 0);
      return {
        title: `${ddmy.day} ${ddmy.date} ${ddmy.month}`,
        dataIndex: "attendance",
        key: "attendance",
        className: today === date.getTime() ? styles.today : "",
        render: (text: any) => {
          let attendanceStatus = text?.[date.getTime()];
          return (
            <span
              style={{
                // backgroundColor:
                //   today === date.getTime() ? "#d6e7ff" : "transparent",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Tag
                color={
                  attendanceStatus === "Present"
                    ? "green"
                    : attendanceStatus === "Absent"
                    ? "red"
                    : today === date.getTime()
                    ? "blue"
                    : ""
                }
              >
                {text?.[date.getTime()] || "NA"}
              </Tag>
            </span>
          );
        },
      };
    }),
  ];

  return newColumns;
}

function studentAttendanceStatus(
  currentWeekAttendance: {
    [key: string]: any;
  },
  student: { enrollmentID: string }
) {
  let newAttendance = {};
  Object.values(currentWeekAttendance).forEach((attendance: any) => {
    if (attendance?.presentStudentsList?.includes(student.enrollmentID)) {
      newAttendance = {
        ...newAttendance,
        [attendance.attendanceDate]: "Present",
      };
    } else if (attendance?.absentStudentsList?.includes(student.enrollmentID)) {
      newAttendance = {
        ...newAttendance,
        [attendance.attendanceDate]: "Absent",
      };
    } else {
      newAttendance = {
        ...newAttendance,
        [attendance.attendanceDate]: "NA",
      };
    }
  });
  return {
    ...student,
    attendance: newAttendance,
  };
}
