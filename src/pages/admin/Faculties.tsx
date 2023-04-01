import React, { useCallback, useEffect, useState } from "react";
import { Button, Layout, message, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "../../styles/admin.module.scss";
import { PlusOutlined } from "@ant-design/icons";
import AddStudents from "./addStudents";
import AddFaculty from "./addFaculty";
import { facultiesServices } from "@/utils/api/services";
import { IFaculty } from "@/utils/interfaces";

interface DataType extends IFaculty {
  key: React.Key;
}

const columns: ColumnsType<DataType> = [
  {
    title: "BranchID",
    dataIndex: "branchID",
    width: 100,
  },
  {
    title: "Designation",
    dataIndex: "designation",
    width: 150,
  },
  {
    title: "Email",
    dataIndex: "email",
    width: 200,
  },
  {
    title: "Faculty Type",
    dataIndex: "facultyType",
    width: 150,
  },
  {
    title: "Name",
    dataIndex: "name",
    width: 150,
  },
];

const data: DataType[] = [];
// for (let i = 0; i < 20; i++) {
//   data.push({
//     key: i,
//     branchID: `CS`,
//     designation: "Professor",
//     email: "someone@ietdavv.edu.in",
//     facultyType: "Regular",
//     name: "Faculty name",
//   });
// }

const Faculties: React.FC = () => {
  const [addFacultyModel, setAddFacultyModel] = useState(false);

  const [branchID, setBranchID] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState(null);
  const [facultyType, setFacultyType] = useState("");
  const [name, setName] = useState("");
  const [allFaculties, setAllFaculties] = useState<DataType[]>([]);

  useEffect(() => {
    facultiesServices.getAllFaculties().then((res) => {
      setAllFaculties(res.data.data);
    });
  }, []);

  async function submitData(finalObj: IFaculty) {
    try {
      const res = await facultiesServices.addNewFaculty(finalObj);
      message.success("Faculty added successfully");
    } catch (error) {
      console.log("Error adding faculty : ", error);
      message.error("Error adding faculty");
    }
  }

  function handleSubmit() {
    const facultyObj: IFaculty = {
      branchID,
      designation,
      email: email as unknown as string,
      facultyType,
      name,
    };
    submitData(facultyObj);
  }

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
          dataSource={allFaculties}
          scroll={{
            x: 800,
            y: 500,
          }}
        />
      </div>
      <AddFaculty
        isModalOpen={addFacultyModel}
        handleOk={() => {
          handleSubmit();
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
