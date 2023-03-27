import React, { useEffect, useState } from "react";
import { Button, Layout, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "../../styles/main.module.scss";
import { PlusOutlined } from "@ant-design/icons";
import AddStudents from "./addStudents";
import AddFaculty from "./addFaculty";

interface DataType {
  key: React.Key;
  branchID: string;
  designation: String;
  email: String;
  facultyType: String;
  name: String;
}

const columns: ColumnsType<DataType> = [
  {
    title: "BranchID",
    dataIndex: "branchID",
  },
  {
    title: "Designation",
    dataIndex: "designation",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Faculty Type",
    dataIndex: "facultyType",
  },
  {
    title: "Name",
    dataIndex: "name",
  },
];

const data: DataType[] = [];
for (let i = 0; i < 20; i++) {
  data.push({
    key: i,
    branchID: `CS`,
    designation: "Professor",
    email: "someone@ietdavv.edu.in",
    facultyType: "Regular",
    name: "Faculty name",
  });
}

const Faculties: React.FC = () => {
  const [addFacultyModel, setAddFacultyModel] = useState(false);

  const [branchID, setBranchID] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState(null);
  const [facultyType, setFacultyType] = useState("");
  const [name, setName] = useState("");

  return (
    <div className={styles.main}>
      <div className={styles.flexRow}>
        <h3>Faculties</h3>
        <div className={styles.actionBtns}>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setAddFacultyModel(true);
            }}
          >
            Add Faculty
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
      <AddFaculty
        isModalOpen={addFacultyModel}
        handleOk={() => {
          console.log("BranchID : ", branchID);
          console.log("Designation : ", designation);
          console.log("Email : ", email);
          console.log("FacultyType : ", facultyType);
          console.log("Name : ", name);
          setAddFacultyModel(false);
        }}
        handleCancel={() => {
          setAddFacultyModel(false);
        }}
        setBranchID={setBranchID}
        setDesignation={setDesignation}
        setEmail={setEmail}
        setFacultyType={setFacultyType}
        setName={setName}
      />
    </div>
  );
};

export default Faculties;
