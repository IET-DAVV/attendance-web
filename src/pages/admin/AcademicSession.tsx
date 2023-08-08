import React, { useEffect, useState } from "react";
import { Button, Layout, Popconfirm, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "../../styles/admin.module.scss";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import AddAcademicSession from "./addAcademicSession";
import { useGlobalContext } from "@/utils/context/GlobalContext";
import { constantsServices } from "@/utils/api/services";
import CustomTable from "@/components/CustomTable";

interface DataType {
  key: React.Key;
  session: string;
}

const data: DataType[] = [];

export function getSessionFormatted(session: string) {
  const split = session.split("_");
  return `${split[0]} - ${split[1]} (Session ${split[2]})`;
}

const AcademicSession: React.FC = () => {
  const [addAcademicSessionModel, setAddAcademicSessionModel] = useState(false);
  const [academicSession, setAcademicSession] = useState("");
  const [oldAcademicSession, setOldAcademicSession] = useState("");
  const [editMode, setEditMode] = useState(false);

  const [loading, setLoading] = useState(false);

  const { fetchAcademicSessions, setAllAcademicSessions, allAcademicSessions } =
    useGlobalContext();

  const deleteAcademicSessionHandler = async (session: string) => {
    console.log(data);
    setLoading(true);
    try {
      await constantsServices.deleteAcademicSession(session);
      setAllAcademicSessions(
        allAcademicSessions.filter(
          (academicSession) => academicSession !== session
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
      width: "90%",
      render: (session) => <span>{getSessionFormatted(session)}</span>,
    },
    {
      title: "Actions",
      dataIndex: "action",
      width: "10%",
      render: (_, record) => (
        <div className={styles.actionBtns}>
          <Button
            type="text"
            shape="circle"
            onClick={() => {
              setAcademicSession(record.session);
              setOldAcademicSession(record.session);
              setEditMode(true);
              setAddAcademicSessionModel(true);
            }}
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title={`Delete ${getSessionFormatted(record.session)}`}
            description="Are you sure to delete this Academic Session?"
            onConfirm={deleteAcademicSessionHandler.bind(null, record.session)}
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
    fetchAcademicSessions();
  }, []);

  async function handleSubmit() {
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
            if (as === oldAcademicSession) {
              return academicSession;
            }
            return as;
          })
        );
        setEditMode(false);
        setAddAcademicSessionModel(false);
        return;
      }

      await constantsServices.addNewAcademicSession(academicSession);
      setAllAcademicSessions([...allAcademicSessions, academicSession]);
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
        <CustomTable
          loading={loading}
          bordered
          columns={columns}
          dataSource={allAcademicSessions?.map((session) => ({
            session,
            key: session,
          }))}
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
