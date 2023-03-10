import React, { useState } from "react";
import {
  BookFilled,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
import AddStudents from "./addStudents";
import AddSubjects from "./addSubjects";
import Subjects from "./Subjects";
import Students from "./Students";

const { Header, Content, Footer, Sider } = Layout;

const menuLabels = ["Faculties", "Students", "Subjects"];

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [faculty, setFaculty] = useState(true);
  const [students, setStudents] = useState(false);
  const [subjects, setSubjects] = useState(false);

  const items: MenuProps["items"] = [
    UserOutlined,
    UsergroupAddOutlined,
    BookFilled,
  ].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: menuLabels[index],
    onClick: () => {
      if (index === 0) {
        setFaculty(true), setStudents(false), setSubjects(false);
      } else if (index === 1) {
        setFaculty(false), setStudents(true), setSubjects(false);
      } else if (index === 2) {
        setFaculty(false), setStudents(false), setSubjects(true);
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
          defaultSelectedKeys={["4"]}
          items={items}
        />
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 100 }}>
        <Content style={{ overflow: "initial" }}>
          <div
            style={{
              flexDirection: "column",
              padding: 24,
              textAlign: "center",
              background: colorBgContainer,
            }}
          >
            {faculty}
            {students && <Students />}
            {subjects && <Subjects />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;

//semester drop down
//Name me space dena
//flex direction column(label and input)

//display table of existing subjects and add new subject button to add new
//opens model on clicking
