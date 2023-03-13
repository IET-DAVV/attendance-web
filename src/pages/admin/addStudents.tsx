import React from "react";
import { Input, Space } from "antd";

const AddStudents: React.FC = () => (
  <Space direction="vertical">
    <Input addonBefore="Email" placeholder="Enter email" />
    <Input addonBefore="EnrollmentID" placeholder="Enter enrollment ID" />
    <Input addonBefore="EnrollmentYear" placeholder="Enter enrollment year" />
    <Input addonBefore="Name" placeholder="Enter name" />
    <Input addonBefore="RollID" placeholder="Enter roll ID" />
    <Input addonBefore="Branch" placeholder="Enter branch" />
    <Input addonBefore="Section" placeholder="Enter section" />
  </Space>
);

export default AddStudents;
