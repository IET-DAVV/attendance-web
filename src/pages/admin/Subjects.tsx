import React, { useEffect, useState } from "react";
import { Button, Layout, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "../../styles/admin.module.scss";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import { PlusOutlined } from "@ant-design/icons";
import AddSubjects from "./addSubjects";
import { useGlobalContext } from "@/utils/context/GlobalContext";

interface DataType {
  key: React.Key;
  subjectName: string;
  subjectCode: string;
  sem: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Subject Name",
    dataIndex: "subjectName",
  },
  {
    title: "Subject Code",
    dataIndex: "subjectCode",
  },
  {
    title: "Semester",
    dataIndex: "sem",
  },
];

const data: DataType[] = [];
for (let i = 0; i < 20; i++) {
  // data.push({
  //   key: i,
  //   subjectname: `Paradigm`,
  //   subjectcode: "CER4C2",
  //   semester: `${i}`,
  // });
}

const Subjects: React.FC = () => {
  const [addSubjectModel, setAddSubjectModel] = useState(false);

  const [semester, setSemester] = useState(null);
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [allSubjects, setAllSubjects] = useState<DataType[]>([]);

  const { branches } = useGlobalContext();

  useEffect(() => {
    if (branches?.length) {
      let tempAllSubjects: any = [];
      branches.forEach((branch) => {
        tempAllSubjects = [
          ...tempAllSubjects,
          ...Object.values(branch.subjects).map((subject) => ({
            key: subject.subjectCode,
            ...subject,
          })),
        ];
      });
      console.log(tempAllSubjects);
      setAllSubjects(tempAllSubjects);
    }
  }, [branches]);

  function handleSubmit() {
    const subjectObj = {
      semester,
      subjectCode,
      subjectName,
    };
    console.log("Subject Obj : ", subjectObj);
  }

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
          dataSource={allSubjects}
          scroll={{
            x: 1000,
            y: 500,
          }}
        />
      </div>
      <AddSubjects
        isModalOpen={addSubjectModel}
        handleOk={() => {
          handleSubmit();
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
