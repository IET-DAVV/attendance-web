import React, { useEffect, useState } from "react";
import { Button, Layout, Popconfirm, Table, message } from "antd";
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
  academicSession: string;
  createdAt: number;
  modifiedAt: number;
}

const data: DataType[] = [];

export function getSessionFormatted(session: string) {
  const split = session?.split("_") || [];
  if (split.length !== 3) return session;
  return `${split[0]} - ${split[1]} (Session ${split[2]})`;
}

const AcademicSession: React.FC = () => {
  const [addAcademicSessionModel, setAddAcademicSessionModel] = useState(false);
  const [academicSession, setAcademicSession] = useState({
    academicSession: "",
    createdAt: 0,
    modifiedAt: 0,
  });
  const [oldAcademicSession, setOldAcademicSession] = useState({
    academicSession: "",
    createdAt: 0,
    modifiedAt: 0,
  });
  const [editMode, setEditMode] = useState(false);

  const [loading, setLoading] = useState(false);

  const { fetchAcademicSessions, setAllAcademicSessions, allAcademicSessions } =
    useGlobalContext();

  const deleteAcademicSessionHandler = async (sessionId: string) => {
    console.log(data);
    setLoading(true);
    try {
      await constantsServices.deleteAcademicSession(sessionId);
      setAllAcademicSessions(
        allAcademicSessions.filter(
          (academicSession) => academicSession.academicSession !== sessionId
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
      dataIndex: "academicSession",
      width: "60%",
      render: (session) => <span>{getSessionFormatted(session)}</span>,
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
          <Button
            type="text"
            shape="circle"
            onClick={() => {
              setAcademicSession(record);
              setOldAcademicSession(record);
              setEditMode(true);
              setAddAcademicSessionModel(true);
            }}
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title={`Delete ${getSessionFormatted(record.academicSession)}`}
            description="Are you sure to delete this Academic Session?"
            onConfirm={deleteAcademicSessionHandler.bind(
              null,
              record.academicSession
            )}
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
        await constantsServices.updateAcademicSession({
          id: academicSession.academicSession,
          newData: academicSession,
        });
        setAllAcademicSessions(
          allAcademicSessions.map((as) => {
            if (as.academicSession === oldAcademicSession.academicSession) {
              return {
                ...as,
                academicSession: academicSession.academicSession,
              };
            }
            return as;
          })
        );
        setEditMode(false);
        setAddAcademicSessionModel(false);
        message.success("Academic Session Updated Successfully");
        return;
      }

      await constantsServices.addNewAcademicSession(
        academicSession.academicSession
      );
      setAllAcademicSessions([...allAcademicSessions, academicSession]);
      setAcademicSession({
        academicSession: "",
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
            ...session,
            key: session.academicSession,
          }))}
        />
      </div>
      <AddAcademicSession
        selectedAcademicSession={academicSession}
        editMode={false}
        isModalOpen={addAcademicSessionModel}
        handleOk={() => {
          handleSubmit();
          setAcademicSession({
            academicSession: "",
            createdAt: 0,
            modifiedAt: 0,
          });
          setEditMode(false);
          setAddAcademicSessionModel(false);
        }}
        handleCancel={() => {
          setAcademicSession({
            academicSession: "",
            createdAt: 0,
            modifiedAt: 0,
          });
          setEditMode(false);
          setAddAcademicSessionModel(false);
        }}
        setAcademicSession={setAcademicSession}
      />
    </div>
  );
};

export default AcademicSession;
