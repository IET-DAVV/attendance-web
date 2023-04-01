import React, { useEffect, useState } from "react";
import { Button, Layout, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "../../styles/admin.module.scss";
import { PlusOutlined } from "@ant-design/icons";
import AddStudents from "./addStudents";
import { useGlobalContext } from "@/utils/context/GlobalContext";
import { IStudent } from "@/utils/interfaces";
import { studentServices } from "@/utils/api/services";

interface DataType extends IStudent {
  key: React.Key;
}

const columns: ColumnsType<DataType> = [
  {
    title: "EnrollmentID",
    dataIndex: "enrollmentID",
  },
  {
    title: "Email",
    dataIndex: "email",
    width: 250,
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
    dataIndex: "rollID",
    width: 120,
  },
  {
    title: "Branch",
    dataIndex: "branchID",
    width: 100,
  },
  {
    title: "Section",
    dataIndex: "section",
    width: 100,
  },
];

const Students: React.FC = () => {
  const [addSubjectModel, setAddSubjectModel] = useState(false);

  const [email, setEmail] = useState("");
  const [enrollmentID, setEnrollmentID] = useState("");
  const [enrollmentYear, setEnrollmentYear] = useState(null);
  const [name, setName] = useState("");
  const [rollID, setRollID] = useState("");
  const [branch, setBranch] = useState("");
  const [section, setSection] = useState("");
  const [allStudents, setAllStudents] = useState<DataType[]>([]);

  const { branches } = useGlobalContext();

  useEffect(() => {
    const getAllStudents = async () => {
      const response = await studentServices.getAllStudentsByYear(2021);
      const data: Array<DataType> = response.data.data;
      setAllStudents(
        data?.map((student: IStudent) => ({
          ...student,
          key: student.enrollmentID,
          enrollmentYear: 2021,
        }))
      );
    };
    getAllStudents();
  }, []);

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
          dataSource={allStudents}
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
