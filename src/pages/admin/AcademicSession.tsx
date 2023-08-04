import React, { useEffect, useState } from "react";
import { Button, Layout, Popconfirm, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "../../styles/admin.module.scss";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import { PlusOutlined } from "@ant-design/icons";
import AddAcademicSession from "./addAcademicSession";
import { useGlobalContext } from "@/utils/context/GlobalContext";
import { constantsServices } from "@/utils/api/services";

interface DataType {
  key: React.Key;
  session: string;
}

const data: DataType[] = [];

const AcademicSession: React.FC = () => {
  const [addAcademicSessionModel, setAddAcademicSessionModel] = useState(false);
  const [academicSession, setAcademicSession] = useState("");
  const [oldAcademicSession, setOldAcademicSession] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [allAcademicSessions, setAllAcademicSessions] = useState<DataType[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const deleteAcademicSessionHandler = async (data: {
    key: React.Key;
    session: string;
  }) => {
    console.log(data);
    setLoading(true);
    try {
      await constantsServices.deleteAcademicSession(data.session);
      setAllAcademicSessions(
        allAcademicSessions.filter(
          (academicSession) => academicSession.session !== data.session
        )
      );
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  const columns: ColumnsType<DataType> = [
    {
      title: "Academic Session",
      dataIndex: "session",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 200,
      render: (_, record) => (
        <div className={styles.actionBtns}>
          <Button
            type="primary"
            onClick={() => {
              setAcademicSession(record.session);
              setOldAcademicSession(record.session);
              setEditMode(true);
              setAddAcademicSessionModel(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete the Academic Session"
            description="Are you sure to delete this Academic Session?"
            onConfirm={deleteAcademicSessionHandler.bind(null, record)}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  useEffect(() => {
    const fetchAcademicSessions = async () => {
      setLoading(true);
      try {
        const { data } = await constantsServices.getAllAcademicSession();
        console.log(data);
        setAllAcademicSessions(
          data?.data?.map((academicSession: any, index: number) => ({
            session: academicSession,
            key: index,
          }))
        );
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    fetchAcademicSessions();
  }, []);
  function handleSubmit() {
    console.log(academicSession);
    setLoading(true);
    try {
      if (editMode) {
        constantsServices.updateAcademicSession({
          oldData: oldAcademicSession,
          newData: academicSession,
        });
        setAllAcademicSessions(
          allAcademicSessions.map((as) => {
            if (as.session === oldAcademicSession) {
              return {
                ...as,
                session: academicSession,
              };
            }
            return as;
          })
        );
        setEditMode(false);
        setAddAcademicSessionModel(false);
        return;
      }

      constantsServices.addNewAcademicSession(academicSession);
      setAllAcademicSessions([
        ...allAcademicSessions,
        {
          session: academicSession,
          key: allAcademicSessions.length + 1,
        },
      ]);
      setAcademicSession("");
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
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
              setAddAcademicSessionModel(true);
            }}
          >
            Add Academic Session
          </Button>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <Table
          loading={loading}
          bordered
          // rowSelection={{
          //   type: "checkbox",
          //   ...rowSelection,
          // }}
          columns={columns}
          dataSource={allAcademicSessions}
          scroll={{
            x: 1000,
            y: 500,
          }}
        />
      </div>
      <AddAcademicSession
        selectedAcademicSession={academicSession}
        editMode={false}
        isModalOpen={addAcademicSessionModel}
        handleOk={() => {
          handleSubmit();
          setAcademicSession("");
          setEditMode(false);
          setAddAcademicSessionModel(false);
        }}
        handleCancel={() => {
          setAcademicSession("");
          setEditMode(false);
          setAddAcademicSessionModel(false);
        }}
        setAcademicSession={setAcademicSession}
      />
    </div>
  );
};

export default AcademicSession;
