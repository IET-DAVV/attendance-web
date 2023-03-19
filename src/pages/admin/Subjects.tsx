import React, { useEffect, useState } from "react";
import { Button, Layout, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "../../styles/main.module.scss";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import { PlusOutlined } from "@ant-design/icons";
import AddSubjects from "./addSubjects";

interface DataType {
  key: React.Key;
  subjectname: string;
  subjectcode: string;
  semester: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Subject Name",
    dataIndex: "subjectname",
  },
  {
    title: "Subject Code",
    dataIndex: "subjectcode",
  },
  {
    title: "Semester",
    dataIndex: "semester",
  },
];

const data: DataType[] = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    subjectname: `Paradigm`,
    subjectcode: "CER4C2",
    semester: `${i}`,
  });
}

const Subjects: React.FC = () => {
  const [addSubjectModel, setAddSubjectModel] = useState(false);

  const [semester, setSemester] = useState(null);
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");

  return (
    <div className={styles.main}>
      <div className={styles.flexRow}>
        <h3>Subjects</h3>
        <div className={styles.actionBtns}>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setAddSubjectModel(true);
            }}
          >
            Add Subject
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
      <AddSubjects
        isModalOpen={addSubjectModel}
        handleOk={() => {
          console.log("Semester : ", semester);
          console.log("Subject Code : ", subjectCode);
          console.log("Subject Name : ", subjectName);
          setAddSubjectModel(false);
        }}
        handleCancel={() => {
          setAddSubjectModel(false);
        }}
        setSemester={setSemester}
        setSubjectCode={setSubjectCode}
        setSubjectName={setSubjectName}
      />
    </div>
  );
};

export default Subjects;
