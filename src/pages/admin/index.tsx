import React, { useState } from "react";
import {
  BookFilled,
  CalendarFilled,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
import AddStudents from "./addStudents";
import AddSubjects from "./addSubjects";
import Subjects from "./Subjects";
import Students from "./Students";
import Faculties from "./Faculties";
import TimeTable from "./TimeTable";
import { set } from "date-fns";
import AcademicSession from "./AcademicSession";

const { Header, Content, Footer, Sider } = Layout;

const menuLabels = [
  "Faculties",
  "Students",
  "Subjects",
  "Time Table",
  "Academic Sessions",
];

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [faculty, setFaculty] = useState(true);
  const [students, setStudents] = useState(false);
  const [subjects, setSubjects] = useState(false);
  const [timeTable, setTimeTable] = useState(false);
  const [academicSession, setAcademicSession] = useState(false);

  const items: MenuProps["items"] = [
    UserOutlined,
    UsergroupAddOutlined,
    BookFilled,
    CalendarFilled,
    CalendarFilled,
  ].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: menuLabels[index],
    onClick: () => {
      switch (index) {
        case 0:
          setFaculty(true), setStudents(false), setSubjects(false);
          setTimeTable(false);
          setAcademicSession(false);
          break;
        case 1:
          setFaculty(false), setStudents(true), setSubjects(false);
          setTimeTable(false);
          setAcademicSession(false);
          break;

        case 2:
          setFaculty(false), setStudents(false), setSubjects(true);
          setTimeTable(false);
          setAcademicSession(false);
          break;
        case 3:
          setFaculty(false), setStudents(false), setSubjects(false);
          setTimeTable(true);
          setAcademicSession(false);
          break;
        case 4:
          setFaculty(false), setStudents(false), setSubjects(false);
          setTimeTable(false);
          setAcademicSession(true);
          break;
      }
    },
  }));
  return (
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
            {faculty && <Faculties />}
            {students && <Students />}
            {subjects && <Subjects />}
            {timeTable && <TimeTable />}
            {academicSession && <AcademicSession />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;

//flex direction column(label and input)
