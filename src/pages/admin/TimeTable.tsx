import React, { useEffect, useState } from "react";
import { Button, Dropdown, Form, Menu, Modal, Select, Table } from "antd";
import { ColumnType } from "antd/es/table";
import styles from "../../styles/admin.module.scss";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import { useGlobalContext } from "@/utils/context/GlobalContext";
import { ISubject } from "@/utils/interfaces";

const { Option } = Select;

interface WeekdayRow {
  key: string;
  weekday: string;
  [timeSlot: string]: string;
}

const TimeTable: React.FC = () => {
  const [timeSlots, setTimeSlots] = useState(
    Array.from({ length: 11 }, (_, i) => i + 7)
  );

  const teachers = [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Emma Wilson",
    "Tom Brown",
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCell, setSelectedCell] = useState({ row: -1, column: "" });
  const [form] = Form.useForm();
  const [filteredSubjects, setFilteredSubjects] = useState<ISubject[]>([]);
  const [branch, setBranch] = useState("EI");
  const [section, setSection] = useState("A");

  const { branches, subjects, currentClassInfo } = useGlobalContext();

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

  const showModal = (row: number, column: string) => {
    setSelectedCell({ row, column });
    form.setFieldsValue({ subject: dataSource[row][column] });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const { subject } = values;
      dataSource[selectedCell.row][selectedCell.column] = subject;
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const dataSource: WeekdayRow[] = [
    { key: "Monday", weekday: "Monday" },
    { key: "Tuesday", weekday: "Tuesday" },
    { key: "Wednesday", weekday: "Wednesday" },
    { key: "Thursday", weekday: "Thursday" },
    { key: "Friday", weekday: "Friday" },
  ];

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
      dataIndex: `${time}to${time + 1}`,
      key: `${time}to${time + 1}`,
      render: (text: string, record: WeekdayRow, rowIndex: number) => (
        <div
          onClick={() => showModal(rowIndex, `${time}to${time + 1}` as string)}
          className={styles.cellItem}
        >
          {text || "NA"}
        </div>
      ),
    });
  });

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, timeSlots[timeSlots.length - 1] + 1]);
  };

  const removeTimeSlot = () => {
    setTimeSlots(timeSlots.slice(0, -1));
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
      <Modal
        title="Edit Subject"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className={styles.formContainer}>
          <Form form={form} layout="vertical">
            <Form.Item
              label="Subject Code"
              name="subjectCode"
              rules={[
                { required: true, message: "Please select a subject code!" },
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
              rules={[{ required: true, message: "Please select a teacher!" }]}
            >
              <Select placeholder="Select a teacher">
                {teachers.map((teacher) => (
                  <Option key={teacher} value={teacher}>
                    {teacher}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default TimeTable;
