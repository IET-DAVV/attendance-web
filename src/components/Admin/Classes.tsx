import React, { useEffect, useState } from "react";
import { Button, Layout, Popconfirm, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "../../styles/admin.module.scss";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import AddClass from "./AddNewClass";
import { useGlobalContext } from "@/utils/context/GlobalContext";
import { constantsServices } from "@/utils/api/services";
import CustomTable from "@/components/CustomTable";
import { IClass } from "@/utils/interfaces"; // Make sure to import the IClass interface here

interface DataType {
  key: React.Key;
  id: string;
  createdAt: number;
  modifiedAt: number;
}

const data: DataType[] = [];

const Classes: React.FC = () => {
  const [addClassModel, setAddClassModel] = useState(false);
  const [classData, setClassData] = useState<IClass>({
    id: "",
    createdAt: 0,
    modifiedAt: 0,
  });

  const [editMode, setEditMode] = useState(false);

  const [loading, setLoading] = useState(false);

  // Replace with your global context and functions
  const { fetchClasses, setClasses, classes } = useGlobalContext();

  const deleteClassHandler = async (classId: string) => {
    setLoading(true);
    try {
      await constantsServices.deleteClass(classId);
      setClasses(classes.filter((cls) => cls.id !== classId));
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Class ID",
      dataIndex: "id",
      width: "70%",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      width: "15%",
      render: (createdAt: number) => (
        <span>{new Date(createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      title: "Modified At",
      dataIndex: "modifiedAt",
      width: "15%",
      render: (modifiedAt) => (
        <span>{new Date(modifiedAt).toLocaleDateString()}</span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "action",
      width: "10%",
      render: (_, record) => (
        <div className={styles.actionBtns}>
          {/* <Button
            type="text"
            shape="circle"
            onClick={() => {
              setEditMode(true);
              setClassData(record);
              setAddClassModel(true);
            }}
          >
            <EditOutlined />
          </Button> */}
          <Popconfirm
            title={`Delete ${record.id}`}
            description="Are you sure to delete this Class?"
            onConfirm={deleteClassHandler.bind(null, record.id)}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button danger shape="circle" type="text">
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchClasses();
  }, []);

  // Handle form submission
  async function handleSubmit() {
    console.log({ classData });
    setLoading(true);
    try {
      if (editMode) {
        console.log("edit mode", classData);
        await constantsServices.updateClass(classData);
        setClasses(
          classes.map((as) => {
            if (as.id === classData.id) {
              return {
                ...as,
                ...classData,
              };
            }
            return as;
          })
        );
        setEditMode(false);
        setAddClassModel(false);
        message.success("Class Updated Successfully");
        setLoading(false);
        return;
      }

      await constantsServices.addNewClass(classData);
      setClasses([...classes, classData]);
      setClassData({
        id: "",
        createdAt: 0,
        modifiedAt: 0,
      });
      message.success("Academic Session Added Successfully");
    } catch (err) {
      console.log(err);
      message.error("Something went wrong");
    }
    setLoading(false);
  }

  return (
    <div className={styles.main}>
      <div className={styles.flexRow}>
        <h3>Classes</h3>
        <div className={styles.actionBtns}>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setAddClassModel(true);
            }}
          >
            Add Class
          </Button>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <CustomTable
          loading={loading}
          bordered
          columns={columns}
          dataSource={classes?.map((cls) => ({
            ...cls,
            key: cls.id,
          }))}
        />
      </div>
      <AddClass
        editMode={editMode}
        isModalOpen={addClassModel}
        handleCancel={() => {
          setAddClassModel(false);
          setEditMode(false);
        }}
        handleOk={() => {
          handleSubmit();
          setAddClassModel(false);
          setEditMode(false);
        }}
        setClassData={setClassData}
        classData={classData}
      />
    </div>
  );
};

export default Classes;
