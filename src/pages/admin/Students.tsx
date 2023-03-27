import React, { useEffect, useState } from "react";
import { Button, Layout, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "../../styles/main.module.scss";
import { PlusOutlined } from "@ant-design/icons";
import AddStudents from "./addStudents";
import { useGlobalContext } from "@/utils/context/GlobalContext";

interface DataType {
  key: React.Key;
  email: string;
  enrollmentID: String;
  enrollmentYear: Number;
  name: String;
  rollno: String;
  branch: String;
  section: String;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "EnrollmentID",
    dataIndex: "enrollmentID",
  },
  {
    title: "EnrollmentYear",
    dataIndex: "enrollmentYear",
  },
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "RollNo",
    dataIndex: "rollno",
  },
  {
    title: "Branch",
    dataIndex: "branch",
  },
  {
    title: "Section",
    dataIndex: "section",
  },
];

const data: DataType[] = [];
for (let i = 0; i < 20; i++) {
  data.push({
    key: i,
    email: `19bcs113@ietdavv.edu.in`,
    enrollmentID: "DE19152",
    enrollmentYear: 2019,
    name: "Anurag Pal",
    rollno: "19C8113",
    branch: "CS",
    section: "B",
  });
}

const Students: React.FC = () => {
  const [addSubjectModel, setAddSubjectModel] = useState(false);

  const [email, setEmail] = useState("");
  const [enrollmentID, setEnrollmentID] = useState("");
  const [enrollmentYear, setEnrollmentYear] = useState(null);
  const [name, setName] = useState("");
  const [rollID, setRollID] = useState("");
  const [branch, setBranch] = useState("");
  const [section, setSection] = useState("");

  const { branches } = useGlobalContext();

  useEffect(() => {
    console.log("AllBranches : ", branches);
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.flexRow}>
        <h3>Students</h3>
        <div className={styles.actionBtns}>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setAddSubjectModel(true);
            }}
          >
            Add Student
          </Button>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <Table
          bordered
          // rowSelection={{
          //   type: "checkbox",
          //   ...rowSelection,
          // }}
          columns={columns}
          dataSource={data}
          scroll={{
            x: 1000,
            y: 500,
          }}
        />
      </div>
      <AddStudents
        isModalOpen={addSubjectModel}
        handleOk={() => {
          console.log("Email : ", email);
          console.log("EnrollmentID : ", enrollmentID);
          console.log("EnrollmentYear : ", enrollmentYear);
          console.log("Name : ", name);
          console.log("RollID : ", rollID);
          console.log("Branch : ", branch);
          console.log("Section : ", section);
          setAddSubjectModel(false);
        }}
        handleCancel={() => {
          setAddSubjectModel(false);
        }}
        setEmail={setEmail}
        setEnrollmentID={setEnrollmentID}
        setEnrollmentYear={setEnrollmentYear}
        setName={setName}
        setRollID={setRollID}
        setBranch={setBranch}
        setSection={setSection}
      />
    </div>
  );
};

export default Students;
