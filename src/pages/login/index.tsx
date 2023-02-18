import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, Typography, Card } from "antd";
import Head from "next/head";
import { useState } from "react";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import styles from "./Login.module.scss";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(values);
  }

  return (
    <MainLayout className={styles.container}>
      <Head>
        <title>Login</title>
      </Head>
      <Card className={styles.card}>
        <Typography.Title level={2}>Login</Typography.Title>
        <form onSubmit={handleSubmit}>
          <Input
            required
            type="email"
            placeholder="Email"
            name="email"
            value={values.email}
            prefix={<UserOutlined />}
            onChange={handleChange}
          />
          <Input
            required
            type="password"
            placeholder="Password"
            name="password"
            value={values.password}
            prefix={<LockOutlined />}
            onChange={handleChange}
          />
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
            disabled={values.email.length === 0 || values.password.length === 0}
          >
            Submit
          </Button>
          <Button type="link">Forgot Password</Button>
        </form>
      </Card>
    </MainLayout>
  );
};

export default Login;
