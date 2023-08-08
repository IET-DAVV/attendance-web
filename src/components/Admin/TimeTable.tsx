import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Input,
  Menu,
  Modal,
  Row,
  Select,
  Table,
} from "antd";
import { ColumnType } from "antd/es/table";
import styles from "../../styles/admin.module.scss";
import { useGlobalContext } from "@/utils/context/GlobalContext";
import { IFaculty, ISubject } from "@/utils/interfaces";
import { facultiesServices } from "@/utils/api/services";
import { getSessionFormatted } from "./AcademicSession";
import { getInitials } from "@/utils/functions";

const { Option } = Select;

type TimeSlot = {
  type: "lecture" | "break" | "lab";
} & (
  | {
      type: "lecture" | "lab";
      subjectCode: string;
      roomNumber: string;
      faculty: {
        id: string;
        name: string;
      };
    }
  | { type: "break"; subjectCode?: never; roomNumber?: never; faculty?: never }
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
  const [faculties, setFaculties] = useState<Array<IFaculty>>([]);
  const [dataSource, setDataSource] = useState<WeekdayRow[]>([
    { key: "Monday", weekday: "Monday", timeSlots: {} },
    { key: "Tuesday", weekday: "Tuesday", timeSlots: {} },
    { key: "Wednesday", weekday: "Wednesday", timeSlots: {} },
    { key: "Thursday", weekday: "Thursday", timeSlots: {} },
    { key: "Friday", weekday: "Friday", timeSlots: {} },
    { key: "Saturday", weekday: "Saturday", timeSlots: {} },
  ]);

  const {
    branches,
    subjects,
    currentClassInfo,
    fetchAcademicSessions,
    allAcademicSessions,
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
        roomNumber: "",
      };
      setDataSource(newDataSource);
      form.resetFields();
      setIsModalVisible(true);
      return;
    }
    const { subjectCode, faculty, roomNumber } = cellData;
    form.setFieldsValue({ subjectCode, faculty, roomNumber });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const { subjectCode, faculty, roomNumber } = values;
      const newRow = { ...dataSource[selectedCell.row] };
      const facultyName = faculties.find((fac) => fac.id === faculty)?.name;
      if (!newRow.timeSlots) {
        newRow.timeSlots = {};
      }
      newRow.timeSlots[selectedCell.column] = {
        subjectCode,
        faculty: { name: facultyName as string, id: faculty },
        roomNumber,
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

  timeSlots.forEach((time) => {
    const amPm = time >= 12 ? "PM" : "AM";
    const hour12 = time % 12 || 12;
    columns.push({
      title: `${hour12} - ${hour12 + 1} ${amPm}`,
      dataIndex: "timeSlots",
      key: `${time}to${time + 1}`,
      render: (
        timeSlot: {
          [timeSlot: string]: TimeSlot;
        },
        record: WeekdayRow,
        rowIndex: number
      ) => {
        const column = `${time}to${time + 1}`;
        return (
          <div
            onClick={() =>
              showModal(rowIndex, `${time}to${time + 1}` as string)
            }
            className={styles.cellItem}
          >
            {!timeSlot?.[column]
              ? "NA"
              : timeSlot?.[column]?.type === "break"
              ? `BREAK`
              : `${timeSlot?.[column]?.subjectCode || "NA"} ${
                  getInitials(timeSlot?.[column]?.faculty?.name as string) || ""
                } ${timeSlot?.[column]?.roomNumber || ""}`}
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

  const timeSlotActions = (
    <Menu>
      <Menu.Item key="1" onClick={addTimeSlot}>
        Add Time Slot
      </Menu.Item>
      <Menu.Item key="2" onClick={removeTimeSlot}>
        Remove Time Slot
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.main}>
      <div className={styles.flexRow}>
        <h3>Time Table</h3>
        <div className={styles.actionBtns}>
          <Select placeholder="Select Branch">
            {Object.values(branches).map((branch) => (
              <Option key={branch.branchID} value={branch.branchID}>
                {branch.branchID} - {branch.branchName}
              </Option>
            ))}
          </Select>
          <Select placeholder="Select Section">
            {["A", "B", "NA"].map((section) => (
              <Option key={section} value={section}>
                {section}
              </Option>
            ))}
          </Select>
          <Select placeholder="Select Academic Session">
            {allAcademicSessions?.map((session) => (
              <Option key={session} value={session}>
                {getSessionFormatted(session)}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <div className={styles.timeTable}>
          <Table
            bordered
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
      <div>
        <Button type="primary">Submit</Button>
      </div>
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
                    <Select placeholder="Select a subject code">
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
                    <Select showSearch={true} placeholder="Select a teacher">
                      {faculties.map((faculty) => (
                        <Option key={faculty.name} value={faculty.id}>
                          {faculty.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Room Number"
                    name="roomNumber"
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
              <Card title="Add Recess" style={{ height: "100%" }}>
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
