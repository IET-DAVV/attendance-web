import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Menu,
  Modal,
  Result,
  Row,
  Select,
  Table,
  message,
} from "antd";
import { ColumnType } from "antd/es/table";
import styles from "../../styles/admin.module.scss";
import { useGlobalContext } from "@/utils/context/GlobalContext";
import {
  IFaculty,
  ISubject,
  ITimeSlot,
  ITimeTable,
  ITimeTableData,
} from "@/utils/interfaces";
import { facultiesServices, timeTableServices } from "@/utils/api/services";
import { getSessionFormatted } from "./AcademicSession";
import { getInitials } from "@/utils/functions";

const { Option } = Select;

type TimeSlot = {
  type: "lecture" | "break" | "lab";
} & (
  | {
      type: "lecture" | "lab";
      subjectCode: string;
      room: string;
      faculty: {
        id: string;
        name: string;
      };
    }
  | { type: "break"; subjectCode?: never; room?: never; faculty?: never }
);

interface WeekdayRow {
  key: string;
  weekday: string;
  timeSlots: {
    [timeSlot: string]: TimeSlot;
  };
}

const TimeTable: React.FC = () => {
  const [timeSlots, setTimeSlots] = useState(
    Array.from({ length: 11 }, (_, i) => i + 7)
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCell, setSelectedCell] = useState({ row: -1, column: "" });
  const [form] = Form.useForm();
  const [filteredSubjects, setFilteredSubjects] = useState<ISubject[]>([]);
  const [branch, setBranch] = useState("EI");
  const [section, setSection] = useState("A");
  const [academicSession, setAcademicSession] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [faculties, setFaculties] = useState<Array<IFaculty>>([]);
  const [apiTimeTable, setApiTimeTable] = useState<ITimeTableData>({}); // This is the time table that we get from the backend
  const [dataSource, setDataSource] = useState<WeekdayRow[]>([
    { key: "Monday", weekday: "Monday", timeSlots: {} },
    { key: "Tuesday", weekday: "Tuesday", timeSlots: {} },
    { key: "Wednesday", weekday: "Wednesday", timeSlots: {} },
    { key: "Thursday", weekday: "Thursday", timeSlots: {} },
    { key: "Friday", weekday: "Friday", timeSlots: {} },
    { key: "Saturday", weekday: "Saturday", timeSlots: {} },
  ]);
  const [loading, setLoading] = useState(false);

  const {
    branches,
    subjects,
    currentClassInfo,
    fetchAcademicSessions,
    allAcademicSessions,
    classes,
  } = useGlobalContext();

  useEffect(() => {
    if (branch?.length) {
      setFilteredSubjects(
        subjects.filter(
          (subject) =>
            subject.branchID === branch && subject.sem === currentClassInfo.sem
        )
      );
    }
  }, [branch, section, subjects, currentClassInfo]);

  useEffect(() => {
    async function fetchFaculties() {
      const res = await facultiesServices.getAllFaculties();
      setFaculties(res.data.data);
    }
    fetchFaculties();
  }, []);

  useEffect(() => {
    async function fetchAndSetTimetable() {
      const { data } = await timeTableServices.getTimeTable(
        academicSession,
        selectedClass
      );
      const { timeTable } = data.data as ITimeTable;
      if (timeTable) {
        console.log(timeTable);
        setApiTimeTable(timeTable);
      }
    }
    if (branch && section && academicSession && selectedClass) {
      fetchAndSetTimetable();
    }
  }, [branch, section, academicSession, selectedClass]);

  useEffect(() => {
    if (dataSource && apiTimeTable) {
      setLoading(true);
      const newDataSource = [...dataSource];
      Object.entries(apiTimeTable).forEach(([day, timeSlots]) => {
        const dayIndex = newDataSource.findIndex((row) => row.weekday === day);
        if (dayIndex !== -1) {
          newDataSource[dayIndex].timeSlots = {
            ...newDataSource[dayIndex].timeSlots,
            ...timeSlots,
          };
        }
      });
      setDataSource(newDataSource);
      setLoading(false);
    }
  }, [dataSource, apiTimeTable]);

  useEffect(() => {
    if (!allAcademicSessions?.length) {
      fetchAcademicSessions();
    }
  }, [allAcademicSessions]);

  const showModal = (row: number, column: string) => {
    setSelectedCell({ row, column });
    const cellData = dataSource?.[row]?.timeSlots?.[column];
    if (!cellData) {
      const newDataSource = [...dataSource];
      if (!newDataSource?.[row].timeSlots?.[column]) {
        newDataSource[row].timeSlots[column] = {} as TimeSlot;
      }
      newDataSource[row].timeSlots[column] = {
        type: "lecture",
        subjectCode: "",
        faculty: { id: "", name: "" },
        room: "",
      };
      setDataSource(newDataSource);
      form.resetFields();
      setIsModalVisible(true);
      return;
    }
    const { subjectCode, faculty, room } = cellData;
    form.setFieldsValue({ subjectCode, faculty, room });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const { subjectCode, faculty, room } = values;
      const newRow = { ...dataSource[selectedCell.row] };
      const facultyName = faculties.find((fac) => fac.id === faculty)?.name;
      if (!newRow.timeSlots) {
        newRow.timeSlots = {};
      }
      newRow.timeSlots[selectedCell.column] = {
        subjectCode,
        faculty: { name: facultyName as string, id: faculty },
        room,
        type: "lecture",
      };
      const updatedDataSource = [...dataSource];
      updatedDataSource[selectedCell.row] = newRow;
      setDataSource(updatedDataSource);
      //send to backend
      setIsModalVisible(false);
      form.resetFields(); // Reset the form after pressing OK
    });
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset the form after pressing OK
  };

  const columns: ColumnType<WeekdayRow>[] = [
    {
      title: "Weekday",
      dataIndex: "weekday",
      key: "weekday",
      fixed: "left",
    },
  ];

  function getSlotId(time: number) {
    return `${time}-${time + 1}`;
  }

  timeSlots.forEach((time) => {
    const amPm = time >= 12 ? "PM" : "AM";
    const hour12 = time % 12 || 12;
    columns.push({
      title: `${hour12} - ${hour12 + 1} ${amPm}`,
      dataIndex: "timeSlots",
      key: getSlotId(time),
      render: (
        timeSlot: {
          [timeSlot: string]: TimeSlot;
        },
        record: WeekdayRow,
        rowIndex: number
      ) => {
        const column = getSlotId(time);
        return (
          <div
            onClick={() => showModal(rowIndex, column)}
            className={styles.cellItem}
          >
            {!timeSlot?.[column]
              ? "NA"
              : timeSlot?.[column]?.type === "break"
              ? `BREAK`
              : `${timeSlot?.[column]?.subjectCode || "NA"} ${
                  getInitials(timeSlot?.[column]?.faculty?.name as string) || ""
                } ${timeSlot?.[column]?.room || ""}`}
          </div>
        );
      },
    });
  });

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, timeSlots[timeSlots.length - 1] + 1]);
  };

  const removeTimeSlot = () => {
    setTimeSlots(timeSlots.slice(0, -1));
  };

  // Add this function to handle the break
  const handleRecess = (row: number, column: string) => {
    const newRow = { ...dataSource[row] };
    if (!newRow.timeSlots) {
      newRow.timeSlots = {};
    }
    newRow.timeSlots[column] = {
      type: "break",
    };
    const updatedDataSource = [...dataSource];
    updatedDataSource[row] = newRow;
    setDataSource(updatedDataSource);
  };

  function generateTimeTable() {
    const timeTable: ITimeTableData = {};
    dataSource.forEach((row) => {
      const day = row.weekday as string;
      row.timeSlots &&
        Object.entries(row.timeSlots).forEach(([timeSlot, timeSlotData]) => {
          const { subjectCode, faculty, room, type } = timeSlotData;
          const [startTime, endTime] = timeSlot
            .split("-")
            .map((time) => parseInt(time));

          let newTimeSlot: ITimeSlot = {
            subjectCode: subjectCode as string,
            room: room as string,
            startTime,
            endTime,
            type,
          };
          if (type === "lecture" || type === "lab") {
            newTimeSlot.faculty = faculty?.id || "";
          }
          timeTable[day] = {
            ...timeTable[day],
            [timeSlot]: newTimeSlot,
          };
        });
    });
    return timeTable;
  }

  async function handleClickSubmit() {
    if (!academicSession || !selectedClass)
      return message.error("Please select Academic Session and Class");
    const loading = message.loading("Generating Time Table...", 0);
    try {
      const timeTable = generateTimeTable();
      await timeTableServices.createTimeTable(
        academicSession,
        selectedClass,
        timeTable
      );
      loading();
      message.success("Time Table Generated Successfully");
    } catch (err) {
      console.log(err);
      loading();
      message.error("Something went wrong");
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.flexRow}>
        <h3>Time Table</h3>
        <div className={styles.actionBtns}>
          <Select
            placeholder="Select Branch"
            showSearch
            onChange={(value) => {
              setBranch(value as string);
            }}
          >
            {Object.values(branches).map((branch) => (
              <Option key={branch.branchID} value={branch.branchID}>
                {branch.branchID} - {branch.branchName}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Select Section"
            onChange={(value) => {
              setSection(value as string);
            }}
          >
            {["A", "B", "NA"].map((section) => (
              <Option key={section} value={section}>
                {section}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Select Academic Session"
            showSearch
            onChange={(value) => {
              setAcademicSession(value as string);
            }}
          >
            {allAcademicSessions?.map((session) => (
              <Option
                key={session?.academicSession}
                value={session?.academicSession}
              >
                {getSessionFormatted(session.academicSession)}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Select Class"
            showSearch
            onChange={(value) => {
              setSelectedClass(value as string);
            }}
          >
            {classes?.map((classItem) => (
              <Option key={classItem.id} value={classItem.id}>
                {classItem.id}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      {!branch || !section || !academicSession || !selectedClass ? (
        <Result
          status="warning"
          title="Please select Branch, Section and Academic Session."
        />
      ) : (
        <>
          <div className={styles.tableContainer}>
            <div className={styles.timeTable}>
              <Table
                bordered
                loading={loading}
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                scroll={{
                  x: 1400,
                  y: "100%",
                }}
                style={{
                  height: "100%",
                }}
              />
            </div>
          </div>
          <div className={styles.submitBtn}>
            <Button type="primary" onClick={handleClickSubmit}>
              Submit
            </Button>
          </div>
        </>
      )}
      <Modal
        title="Edit Subject"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className={styles.formContainer}>
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Add Subject" style={{ height: "100%" }}>
                <Form form={form} layout="vertical">
                  <Form.Item
                    label="Subject Code"
                    name="subjectCode"
                    rules={[
                      {
                        required: true,
                        message: "Please select a subject code!",
                      },
                    ]}
                  >
                    <Select placeholder="Select a subject code" showSearch>
                      {filteredSubjects.map((subject, i) => (
                        <Option
                          key={subject.subjectCode + i}
                          value={subject.subjectCode}
                        >
                          {subject.subjectCode} - {subject.subjectName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Faculty"
                    name="faculty"
                    rules={[
                      { required: true, message: "Please select a teacher!" },
                    ]}
                  >
                    <Select showSearch placeholder="Select a teacher">
                      {faculties.map((faculty) => (
                        <Option key={faculty.name} value={faculty.id}>
                          {faculty.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Room Number"
                    name="room"
                    rules={[
                      {
                        required: true,
                        message: "Please enter a room number!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter room number" />
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Add Break" style={{ height: "100%" }}>
                <Form.Item>
                  <Button
                    type="primary"
                    onClick={() => {
                      handleRecess(selectedCell.row, selectedCell.column);
                      setIsModalVisible(false);
                    }}
                  >
                    Set Break
                  </Button>
                </Form.Item>
              </Card>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
};

export default TimeTable;
