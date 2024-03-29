import Head from "next/head";
import { createRef, useCallback, useEffect, useRef, useState } from "react";
import {
  attendanceServices,
  studentServices,
  timeTableServices,
} from "@/utils/api/services";
import {
  disabledFutureDate,
  getCurrentWeekDates,
  getDateDayMonthYear,
  getTableFilters,
  getTableSorter,
  getToday12AMDatetime,
  getTotalDaysCountInCurrentMonth,
  mapAttendanceValues,
  separateAttendance,
  uniqueDatesOnly,
} from "@/utils/functions";
import styles from "../styles/main.module.scss";
import {
  Button,
  DatePicker,
  Dropdown,
  MenuProps,
  message,
  Pagination,
  Result,
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
import { CSVLink } from "react-csv";
import { IStudentAttendance } from "@/utils/interfaces";
const { RangePicker } = DatePicker;
import { PDFDownloadLink } from "@react-pdf/renderer";
import TablePDF from "@/components/TablePDF";
import DetainStudents from "../components/detainStudents";
import { EXAM_TABLE_FILTER } from "@/utils/constants";
import { getSessionFormatted } from "@/components/Admin/AcademicSession";

const { Option } = Select;

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
  // {
  //   key: "3",
  //   label: "Edit Attendance",
  //   icon: <EditOutlined />,
  //   disabled: true,
  // },
  {
    key: "4",
    label: "Detain Students",
    icon: <UserDeleteOutlined />,
  },
];

export default function Home() {
  const [attendance, setAttendance] = useState([]);
  const [detainedStudents, setDetainedStudents] = useState<any>({});
  const [editAttendanceDate, setEditAttendanceDate] = useState<
    Date | undefined
  >(undefined);
  const [currentWeekAttendance, setCurrentWeekAttendance] = useState({});
  const [newAttendanceDrawer, setNewAttendanceDrawer] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [editAttendanceMode, setEditAttendanceMode] = useState(false);
  const [isClientSide, setIsClientSide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isClickedOnExportPDF, setIsClickedOnExportPDF] = useState(false);
  const [detainedStudentModal, setDetainStudentModal] = useState(false);
  const [exam, setExam] = useState("");
  const [currentDateRange, setCurrentDateRange] = useState<any>([
    dayjs(getCurrentWeekDates()[0]),
    dayjs(getCurrentWeekDates()[5]),
  ]);
  const {
    studentsAttendance,
    setStudentsAttendance,
    currentClassInfo,
    setCurrentClassInfo,
    academicYear,
    subjects,
    allAcademicSessions,
    classes,
    fetchClasses,
    fetchAcademicSessions,
    academicSession,
    setAcademicSession,
  } = useGlobalContext();

  const [columns, setColumns] = useState<Array<any>>([]);
  console.log({ studentsAttendance });
  const csvBtnRef = useRef<
    CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }
  >(null);

  let prevColumns = [
    {
      title: "Roll No.",
      dataIndex: "rollID",
      key: "rollID",
      width: 100,
      fixed: "left",
      ...getTableSorter("rollID"),
    },
    {
      title: "Enroll No.",
      dataIndex: "enrollmentID",
      key: "enrollmentID",
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      ...getTableSorter("name"),
      render: (text: string, record: any) => {
        return (
          <span
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              textTransform: "capitalize",
              gap: "1rem",
            }}
          >
            {text.toLowerCase()}
            {record?.detainedIn?.length > 0 && (
              <Tooltip title={record?.detainedIn?.join(" , ")}>
                <Tag
                  style={{
                    cursor: "pointer",
                  }}
                  color="red"
                >
                  D
                </Tag>
              </Tooltip>
            )}
          </span>
        );
      },
    },
    {
      title: "Detained in",
      key: "detainedIn",
      dataIndex: "detainedIn",
      width: 200,
      ...EXAM_TABLE_FILTER,
      render: (detainedExams: Array<string> | undefined, record: any) => {
        if (detainedExams?.length == 0) {
          return <span>NA</span>;
        }
        return detainedExams?.map((exam: string, idx: number) => (
          <Tag key={idx} color="blue">
            {exam}
          </Tag>
        ));
      },
    },
  ];
  async function handleClickEditiAttendance(date: Date) {
    setNewAttendanceDrawer(true);
    setEditAttendanceDate(date);
  }
  const convertDetainedStudentsToMap = (data: any) => {
    console.log(data);
    let list: any = {};
    data["mst1"]?.forEach((student: any) => {
      if (list[student]) list[student] = [...list[student], "MST1"];
      else {
        list[student] = ["MST1"];
      }
    });

    data["mst2"]?.forEach((student: any) => {
      if (list[student]) list[student] = [...list[student], "MST2"];
      else {
        list[student] = ["MST2"];
      }
    });
    data["mst3"]?.forEach((student: any) => {
      if (list[student]) list[student] = [...list[student], "MST3"];
      else {
        list[student] = ["MST3"];
      }
    });
    data["endSem"]?.forEach((student: any) => {
      if (list[student]) list[student] = [...list[student], "ENDSEM"];
      else {
        list[student] = ["ENDSEM"];
      }
    });
    return list;
  };
  useEffect(() => {
    const fetchDetainedStudents = async () => {
      const res = await attendanceServices.getDetainedStudents(
        academicSession,
        currentClassInfo?.subjectCode,
        currentClassInfo?.id
      );
      let modifiedDetainedList: any = {};
      modifiedDetainedList = convertDetainedStudentsToMap(res.data.data);
      console.log(modifiedDetainedList);
      setDetainedStudents(modifiedDetainedList);
    };
    if (currentClassInfo?.id) {
      fetchDetainedStudents();
    }
  }, [currentClassInfo, academicSession]);

  const getCurrentDateRangeAttendance = useCallback(async () => {
    setLoading(true);
    const { data } = await attendanceServices.getStudentsAttendanceInDateRange(
      academicSession as unknown as string,
      {
        startDate: currentDateRange[0].toDate().getTime(),
        endDate: currentDateRange[1].toDate().getTime(),
      },
      currentClassInfo.subjectCode,
      currentClassInfo?.id
    );
    console.log("data", data);
    setCurrentWeekAttendance(data.data);
    let newDateCols = uniqueDatesOnly(
      Object.keys(data.data)?.map((date) =>
        getAttendaceCell(new Date(Number(date)), handleClickEditiAttendance)
      )
    ).sort((a: any, b: any) => a.date - b.date);

    setColumns([...prevColumns, ...newDateCols, getAttendancePercentageCol()]);
    setLoading(false);
  }, [currentDateRange, currentClassInfo, academicSession, detainedStudents]);

  useEffect(() => {
    if (
      currentDateRange?.length &&
      currentClassInfo?.subjectCode &&
      currentClassInfo?.id &&
      academicSession
    ) {
      console.log("Calling current date range");
      getCurrentDateRangeAttendance();
    }
  }, [
    currentDateRange,
    currentClassInfo,
    academicSession,
    getCurrentDateRangeAttendance,
  ]);

  async function markStudentsStatus(
    stduentsList: Array<IStudentAttendance>,
    config: {
      date: number;
      subjectCode: string;
      classID: string;
    },
    status: "present" | "absent"
  ) {
    const loadingMessage = message.loading(
      "Marking attendance for " + stduentsList.length + " students",
      0
    );
    try {
      const { date, subjectCode, classID } = config;
      await attendanceServices.markStudentAttendanceMultiple(
        academicSession as unknown as string,
        subjectCode,
        date.toString(),
        stduentsList?.map((student) => student.enrollmentID),
        status,
        classID
      );
      loadingMessage();
      message.success(stduentsList.length + " students marked " + status);
    } catch (error: any) {
      loadingMessage();
      message.error(error.message);
    }
  }
  useEffect(() => {
    if (window && !isClientSide) {
      setIsClientSide(true);
    }
  }, []);

  async function handleSubmitAttendance() {
    const { absentStudents, presentStudents, date, subjectCode, classID } =
      separateAttendance(studentsAttendance, currentClassInfo);
    if (!subjectCode || !classID) {
      message.error("Please select a subject and class to mark attendance");
      return;
    }
    if (!absentStudents.length && !presentStudents.length) {
      message.error("Please mark attendance for atleast one student");
      return;
    }
    await markStudentsStatus(
      absentStudents,
      {
        date,
        subjectCode: subjectCode as string,
        classID,
      },
      "absent"
    );
    await markStudentsStatus(
      presentStudents,
      {
        date,
        subjectCode: subjectCode as string,
        classID,
      },
      "present"
    );
  }
  useEffect(() => {
    // let newColumns = getNewColumnsForCurrentWeek(prevColumns);
    setColumns(prevColumns);
  }, []);

  useEffect(() => {
    if (Object.values(currentWeekAttendance)?.length && currentClassInfo?.id) {
      // console.log("BADAL RHA HAI");
      setStudentsAttendance((prev: any) =>
        prev.map((student: any) =>
          studentAttendanceStatus(currentWeekAttendance, student)
        )
      );
    }
  }, [currentWeekAttendance, currentClassInfo.id]);

  const onMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "1") {
      if (csvBtnRef.current) csvBtnRef?.current?.link?.click();
    }
    if (e.key === "2") {
      setIsClickedOnExportPDF(true);
    }
    if (e.key === "3") {
      setEditAttendanceMode(true);
    }
    if (e.key === "4") {
      setDetainStudentModal(true);
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
    await handleSubmitAttendance();
    setNewAttendanceDrawer(false);
  }

  async function handleClickDetainStudents() {
    const loadingMessage = message.loading(
      "Detaining " + selectedRows.length + " students",
      0
    );
    try {
      if (!selectedRows?.length)
        throw new Error("Please select atleast one student");
      if (!exam.length) throw new Error("Please select an exam");
      await attendanceServices.detainStudentFromExamMultiple(
        academicYear,
        currentClassInfo.subjectCode,
        currentClassInfo.id,
        exam,
        selectedRows?.map((st) => st.enrollmentID) as string[]
      );
      loadingMessage();
      message.success(selectedRows.length + " students detained");
      setDetainStudentModal(false);
    } catch (error: any) {
      loadingMessage();
      message.error(error.message);
    }
  }

  useEffect(() => {
    if (isClickedOnExportPDF && isClientSide) {
      const pdfBtnContainer = document.getElementById("pdfBtnContainer");
      setTimeout(() => {
        const a = pdfBtnContainer?.querySelector("a");
        a?.click();
        setIsClickedOnExportPDF(false);
      }, 1000);
    }
  });
  console.log(studentsAttendance);
  let studentsAttendanceWithDetention = studentsAttendance.map(
    (student: any) => {
      if (detainedStudents[student.enrollmentID]) {
        return {
          ...student,
          detainedIn: detainedStudents[student.enrollmentID],
        };
      }
      return { ...student, detainedIn: [] };
    }
  );

  useEffect(() => {
    if (!classes?.length) {
      fetchClasses();
    }
    if (!allAcademicSessions?.length) {
      fetchAcademicSessions();
    }
  }, [classes, allAcademicSessions]);

  useEffect(() => {
    if (!academicSession) return;
    const facultyId = "FAC_CS_RAK1692376560914";
    const teacherDays = timeTableServices
      .getTeacherTimetableForDay(academicSession ?? "", facultyId, "Monday")
      .then((res) => {
        console.log({ res });
      });
  }, [academicSession]);

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
          <div className={styles.selectClass}>
            <Select
              placeholder="Subject Code"
              value={currentClassInfo?.subjectCode}
              showSearch
              onChange={(value) => {
                setCurrentClassInfo((prev) => ({
                  ...prev,
                  subjectCode: value,
                }));
              }}
            >
              {subjects?.map((subject) => (
                <Option key={subject.subjectCode} value={subject.subjectCode}>
                  {subject.subjectCode}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Academic Session (1/2)"
              value={academicSession || undefined}
              onChange={(value) => {
                setAcademicSession(value);
              }}
            >
              {allAcademicSessions?.map((session) => (
                <Option key={session.id} value={session.academicSession}>
                  {getSessionFormatted(session.academicSession)}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Select Class"
              value={currentClassInfo?.id}
              onChange={(value) => {
                setCurrentClassInfo((prev) => ({
                  ...prev,
                  id: value,
                  branch: value.split("_")[1],
                  section: value.split("_")[2],
                  year: parseInt(value.split("_")[0]),
                }));
              }}
            >
              {classes?.map((cls) => (
                <Option key={cls.id} value={cls.id}>
                  {cls.id}
                </Option>
              ))}
            </Select>
          </div>
          <div style={{ visibility: "hidden" }} id="pdfBtnContainer">
            {isClientSide && isClickedOnExportPDF && columns.length && (
              <PDFDownloadLink
                className="test"
                document={
                  <TablePDF
                    headers={columns?.map((column: any) =>
                      typeof column.title === "string"
                        ? column.title
                        : `${getDateDayMonthYear(column.date).date}/${
                            getDateDayMonthYear(column.date).month
                          }/${getDateDayMonthYear(column.date).year}`
                    )}
                    data={selectedRows?.map((row) => [
                      row.rollID,
                      row.enrollmentID,
                      row.name,
                      ...columns
                        ?.filter((column) => column.date)
                        .map((column: any) => {
                          return (
                            row.attendance?.[column.date.getTime()] || "NA"
                          );
                        }),
                      calculateAttendnacePercentage(row),
                    ])}
                    classInfo={""}
                  />
                }
                fileName="attendance.pdf"
              >
                Download
              </PDFDownloadLink>
            )}
          </div>
          <div className={styles.actionBtns}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {/* <Button
                style={{ marginRight: 15 }}
                type="default"
                onClick={() => {}}
                icon={<EditOutlined />}
              >
                Edit Attendance
              </Button> */}
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
                disabledDate={disabledFutureDate}
                value={currentDateRange}
              />
            </div>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => {
                setNewAttendanceDrawer(true);
                setEditAttendanceDate(new Date());
              }}
            >
              New Attendance
            </Button>
          </div>
        </div>

        <div className={styles.tableContainer}>
          {!(
            currentClassInfo?.id &&
            currentClassInfo?.subjectCode &&
            academicSession
          ) ? (
            <Result title="Select Subject Code, Academic Session and Class to view attendance" />
          ) : (
            <Table
              bordered
              loading={loading}
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
              }}
              columns={columns}
              dataSource={studentsAttendanceWithDetention}
              scroll={{
                x: 1000,
                y: 500,
              }}
            />
          )}
        </div>
        <CSVLink
          ref={csvBtnRef}
          target="_blank"
          data={mapAttendanceValues(selectedRows)}
          filename={`attendance-${currentClassInfo.subjectCode}-${currentClassInfo.section}.csv`}
        />
        <AddNewAttendance
          open={newAttendanceDrawer}
          submitAttendance={submitAttendance}
          onClose={() => setNewAttendanceDrawer(false)}
          date={editAttendanceDate}
        />
        <DetainStudents
          isModalOpen={detainedStudentModal}
          handleOk={() => {
            //handleSubmit();
            handleClickDetainStudents();
          }}
          handleCancel={() => {
            setDetainStudentModal(false);
          }}
          setExam={setExam}
          students={selectedRows.length}
        />
      </MainLayout>
    </>
  );
}

// function getNewColumnsForCurrentWeek(prevColumns: Array<any>) {
//   let newColumns: any = [
//     ...prevColumns,
//     ...getCurrentWeekDates().map((date) => getAttendaceCell(date)),
//   ];

//   return newColumns;
// }

function getAttendaceCell(date: Date, onClickEdit: (date: Date) => void) {
  let ddmy = getDateDayMonthYear(date.getTime());
  let today = new Date().setHours(0, 0, 0, 0);
  return {
    title: () => (
      <span style={{ position: "relative", width: "100%", display: "block" }}>
        <Button size="small" type="text" onClick={() => onClickEdit(date)}>
          {ddmy.day} {ddmy.date} {ddmy.month} <EditOutlined />
        </Button>
      </span>
    ),
    dataIndex: "attendance",
    key: "attendance",
    date,
    className: today === date.getTime() ? styles.today : "",
    width: 120,
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
}

function getAttendancePercentageCol() {
  return {
    title: "% Att.",
    dataIndex: "attendancePercentage",
    key: "attendancePercentage",
    fixed: "right",
    width: 100,
    render: (text: any, row: any) => (
      <span>{calculateAttendnacePercentage(row)}%</span>
    ),
  };
}

function calculateAttendnacePercentage(row: any) {
  if (row.attendance) {
    let totalDays = Object.keys(row.attendance).length;
    let presentDays = 0;
    Object.keys(row.attendance).forEach((key) => {
      if (row.attendance[key] === "Present") presentDays++;
    });
    return Math.round((presentDays / totalDays) * 100);
  }
  return 0;
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

Home.getInitialProps = async () => {
  return {}; // Return an empty object to disable server-side rendering
};
