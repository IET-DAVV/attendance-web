import React, { useCallback, useEffect, useState } from "react";
import { Button, Layout, message, Popconfirm, Table } from "antd";
import type { ColumnType } from "antd/es/table";
import styles from "../../styles/admin.module.scss";
import { PlusOutlined } from "@ant-design/icons";
import AddStudents from "./addStudents";
import AddFaculty from "./addFaculty";
import { facultiesServices } from "@/utils/api/services";
import { IFaculty } from "@/utils/interfaces";
import { BRANCH_TABLE_FILTER } from "@/utils/constants";
import { getTableSorter } from "@/utils/functions";
import CustomTable from "@/components/CustomTable";
import {
  FACULTY_TYPE_TABLE_FILTER,
  DESIGNATION_TABLE_FILTER,
} from "@/utils/constants";
import { useGlobalContext } from "@/utils/context/GlobalContext";

interface DataType extends IFaculty {
  key: any;
}

const Faculties: React.FC = () => {
  const [addFacultyModel, setAddFacultyModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<DataType | null>(null);
  const [branchID, setBranchID] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");
  const [facultyType, setFacultyType] = useState("");
  const [name, setName] = useState("");

  const { allFaculties, setAllFaculties, fetchFaculties } = useGlobalContext();

  const deleteFacultyHandler = async (record: any) => {
    console.log(record);
    setLoading(true);
    try {
      await facultiesServices.deleteFaculty(record.id);
      setAllFaculties(
        allFaculties.filter((faculty) => faculty.id !== record.id)
      );
      message.success("Faculty deleted successfully");
    } catch (err) {
      console.log(err);
      message.error("Error deleting faculty");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!allFaculties?.length) {
      setLoading(true);
      fetchFaculties();
      setLoading(false);
    }
  }, [allFaculties]);

  async function submitData(finalObj: IFaculty) {
    setLoading(true);
    try {
      const res = await facultiesServices.addNewFaculty(finalObj);
      message.success("Faculty added successfully");
    } catch (error) {
      console.log("Error adding faculty : ", error);
      message.error("Error adding faculty");
    }
    setLoading(false);
  }
  async function updateData() {
    setLoading(true);
    try {
      console.log("selectedFaculty?.id : ", selectedFaculty);
      const res = await facultiesServices.updateFaculty(
        selectedFaculty?.id as string,
        {
          id: selectedFaculty?.id,
          branchID,
          designation,
          email: email as unknown as string,
          facultyType,
          name,
        }
      );
      setAllFaculties(
        allFaculties.map((faculty) => {
          if (faculty.id === selectedFaculty?.id) {
            return {
              ...faculty,
              branchID,
              designation,
              email: email as unknown as string,
              facultyType,
              name,
            };
          }

          return faculty;
        })
      );
      message.success("Faculty updated successfully");
    } catch (err) {
      console.log("Error updating faculty : ", err);
    }
    setLoading(false);
  }

  function handleSubmit() {
    if (editMode) {
      updateData();
      setEditMode(false);
      setAddFacultyModel(false);
      return;
    }
    const facultyObj: any = {
      branchID,
      designation,
      email: email as unknown as string,
      facultyType,
      name,
    };
    submitData(facultyObj);
  }
  const columns: ColumnType<DataType>[] = [
    {
      title: "BranchID",
      dataIndex: "branchID",
      width: 100,
      ...BRANCH_TABLE_FILTER,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 150,
      ...getTableSorter("name"),
      searchable: true,
    },
    {
      title: "Designation",
      dataIndex: "designation",
      ...DESIGNATION_TABLE_FILTER,
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 200,
      searchable: true,
    },
    {
      title: "Faculty Type",
      dataIndex: "facultyType",
      ...FACULTY_TYPE_TABLE_FILTER,
      width: 150,
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 150,
      render: (_, record) => (
        <div className={styles.actionBtns}>
          <Button
            type="primary"
            onClick={() => {
              setEditMode(true);
              setAddFacultyModel(true);
              setBranchID(record.branchID);
              setDesignation(record.designation);
              setEmail(record?.email);
              setFacultyType(record.facultyType);
              setName(record.name);
              setSelectedFaculty(record);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete the Faculty details"
            description="Are you sure to delete this Faculty details?"
            onConfirm={deleteFacultyHandler.bind(null, record)}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
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
        <CustomTable<DataType>
          loading={loading}
          bordered
          // rowSelection={{
          //   type: "checkbox",
          //   ...rowSelection,
          // }}
          columns={columns}
          dataSource={allFaculties?.map((faculty) => ({
            ...faculty,
            key: faculty.id,
          }))}
          scroll={{
            x: 800,
            y: 500,
          }}
        />
      </div>
      <AddFaculty
        editMode={editMode}
        selectedFaculty={selectedFaculty}
        isModalOpen={addFacultyModel}
        handleOk={() => {
          handleSubmit();
          setAddFacultyModel(false);
          setBranchID("");
          setDesignation("");
          setEmail("");
          setFacultyType("");
          setName("");
          setEditMode(false);
        }}
        handleCancel={() => {
          setBranchID("");
          setDesignation("");
          setEmail("");
          setFacultyType("");
          setName("");
          setEditMode(false);
          setAddFacultyModel(false);
        }}
        setBranchID={setBranchID}
        setDesignation={setDesignation}
        setEmail={setEmail}
        setFacultyType={setFacultyType}
        setName={setName}
        branchID={branchID}
        designation={designation}
        email={email}
        facultyType={facultyType}
        name={name}
      />
    </div>
  );
};

export default Faculties;
