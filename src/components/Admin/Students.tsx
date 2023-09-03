import React, { useEffect, useState } from "react";
import { Button, Layout, message, Table } from "antd";
import type { ColumnType } from "antd/es/table";
import styles from "../../styles/admin.module.scss";
import { PlusOutlined } from "@ant-design/icons";
import AddStudents from "./addStudents";
import { useGlobalContext } from "@/utils/context/GlobalContext";
import { IStudent } from "@/utils/interfaces";
import { studentServices } from "@/utils/api/services";
import { BRANCH_TABLE_FILTER, SECTION_TABLE_FILTER } from "@/utils/constants";
import { getTableSorter } from "@/utils/functions";
import CustomTable from "@/components/CustomTable";

interface DataType extends IStudent {
  key: string;
}

const columns: ColumnType<DataType>[] = [
  {
    title: "EnrollmentID",
    dataIndex: "enrollmentID",
    width: 200,
    ...getTableSorter("enrollmentID"),
  },
  {
    title: "RollNo",
    dataIndex: "rollID",
    width: 120,
    ...getTableSorter("rollID"),
  },
  {
    title: "Branch",
    dataIndex: "branchID",
    width: 120,
    ...BRANCH_TABLE_FILTER,
  },
  {
    title: "Section",
    dataIndex: "section",
    width: 120,
    ...SECTION_TABLE_FILTER,
  },
  {
    title: "Name",
    dataIndex: "name",
    width: 300,
    ...getTableSorter("name"),
    searchable: true,
  },
  {
    title: "Email",
    dataIndex: "email",
    width: 250,
    searchable: true,
  },
  {
    title: "EnrollmentYear",
    dataIndex: "enrollmentYear",
    width: 150,
    searchable: true,
  },
];

const Students: React.FC = () => {
  const [addSubjectModel, setAddSubjectModel] = useState(false);

  const [email, setEmail] = useState("");
  const [enrollmentID, setEnrollmentID] = useState("");
  const [enrollmentYear, setEnrollmentYear] = useState("");
  const [name, setName] = useState("");
  const [rollID, setRollID] = useState("");
  const [branch, setBranch] = useState("");
  const [section, setSection] = useState("");
  const [allStudents, setAllStudents] = useState<DataType[]>([]);

  const { branches } = useGlobalContext();

  useEffect(() => {
    const getAllStudents = async () => {
      const response = await studentServices.getAllStudentsByYear(2022);
      const data: Array<DataType> = response.data.data;
      setAllStudents(
        data
          ?.map((student: IStudent) => ({
            ...student,
            key: student.enrollmentID,
            enrollmentYear: 2021,
          }))
          .sort((a, b) => a.rollID.localeCompare(b.rollID))
      );
    };
    getAllStudents();
  }, []);

  async function submitData(finalObj: IStudent) {
    try {
      const res = await studentServices.addNewStudent(finalObj);
      message.success("Student added successfully");
    } catch (error) {
      console.log("Error adding student : ", error);
      message.error("Error adding student");
    }
  }

  function handleSubmit() {
    const facultyObj: IStudent = {
      email,
      name,
      enrollmentID,
      enrollmentYear: parseInt(enrollmentYear),
      rollID,
      branchID: branch,
      section,
    };
    submitData(facultyObj);
  }

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
        <CustomTable<DataType>
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
          handleSubmit();
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
