import React, { useState } from "react";
import {
  BookOutlined,
  CalendarOutlined,
  FolderOpenOutlined,
  SolutionOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
import Subjects from "../../components/Admin/Subjects";
import Students from "../../components/Admin/Students";
import Faculties from "../../components/Admin/Faculties";
import TimeTable from "../../components/Admin/TimeTable";
import AcademicSession from "../../components/Admin/AcademicSession";
import Classes from "@/components/Admin/Classes";
import Head from "next/head";

const { Header, Content, Footer, Sider } = Layout;

const menuLabels = [
  "Faculties",
  "Students",
  "Subjects",
  "Classes",
  "Time Table",
  "Academic Sessions",
];

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [showFaculties, setShowFaculties] = useState(true);
  const [showStudents, setShowStudents] = useState(false);
  const [showSubjects, setShowSubjects] = useState(false);
  const [showClasses, setShowClasses] = useState(false);
  const [showTimeTable, setShowTimeTable] = useState(false);
  const [academicSession, setAcademicSession] = useState(false);

  const items: MenuProps["items"] = [
    UserOutlined,
    UsergroupAddOutlined,
    BookOutlined,
    FolderOpenOutlined,
    SolutionOutlined,
    CalendarOutlined,
  ].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: menuLabels[index],
    onClick: () => {
      switch (index) {
        case 0:
          setShowFaculties(true),
            setShowStudents(false),
            setShowSubjects(false);
          setShowTimeTable(false);
          setAcademicSession(false);
          setShowClasses(false);
          break;
        case 1:
          setShowFaculties(false),
            setShowStudents(true),
            setShowSubjects(false);
          setShowTimeTable(false);
          setAcademicSession(false);
          setShowClasses(false);
          break;

        case 2:
          setShowFaculties(false),
            setShowStudents(false),
            setShowSubjects(true);
          setShowTimeTable(false);
          setAcademicSession(false);
          setShowClasses(false);
          break;
        case 3:
          setShowClasses(true),
            setShowFaculties(false),
            setShowStudents(false),
            setShowSubjects(false);
          setShowTimeTable(false);
          setAcademicSession(false);
          break;
        case 4:
          setShowFaculties(false),
            setShowStudents(false),
            setShowSubjects(false);
          setShowTimeTable(true);
          setAcademicSession(false);
          setShowClasses(false);
          break;
        case 5:
          setShowFaculties(false),
            setShowStudents(false),
            setShowSubjects(false);
          setShowTimeTable(false);
          setAcademicSession(true);
          setShowClasses(false);
          break;
      }
    },
  }));
  return (
    <>
      <Head>
        <title>IET Admin Pannel</title>
      </Head>
      <Layout hasSider>
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <Header
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 2,
              margin: 8,
              background: "rgba(255, 255, 255, 0.2)",
              color: "rgba(255, 255, 255, 1)",
            }}
          >
            IET Admin Pannel
          </Header>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={items}
          />
        </Sider>
        <Layout className="site-layout" style={{ marginLeft: 200 }}>
          <Content style={{ overflow: "initial" }}>
            <div
              style={{
                flexDirection: "column",
                padding: 24,
                textAlign: "center",
                background: colorBgContainer,
              }}
            >
              {showFaculties && <Faculties />}
              {showStudents && <Students />}
              {showSubjects && <Subjects />}
              {showClasses && <Classes />}
              {showTimeTable && <TimeTable />}
              {academicSession && <AcademicSession />}
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default App;
