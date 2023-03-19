import React from "react";
import { Input, Modal, Space } from "antd";

const AddStudents: React.FC<{
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  setEmail: Function;
  setEnrollmentID: Function;
  setEnrollmentYear: Function;
  setName: Function;
  setRollID: Function;
  setBranch: Function;
  setSection: Function;
}> = ({
  isModalOpen,
  handleOk,
  handleCancel,
  setEmail,
  setEnrollmentID,
  setEnrollmentYear,
  setName,
  setRollID,
  setBranch,
  setSection,
}) => {
  return (
    <Modal
      title="Add Student"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Space direction="vertical">
        <Input
          addonBefore="Email"
          placeholder="Enter email"
          onChange={(data) => {
            setEmail(data.target.value);
          }}
        />
        <Input
          addonBefore="EnrollmentID"
          placeholder="Enter enrollment ID"
          onChange={(data) => {
            setEnrollmentID(data.target.value);
          }}
        />
        <Input
          addonBefore="EnrollmentYear"
          placeholder="Enter enrollment year"
          onChange={(data) => {
            setEnrollmentYear(data.target.value);
          }}
        />
        <Input
          addonBefore="Name"
          placeholder="Enter name"
          onChange={(data) => {
            setName(data.target.value);
          }}
        />
        <Input
          addonBefore="RollID"
          placeholder="Enter roll ID"
          onChange={(data) => {
            setRollID(data.target.value);
          }}
        />
        <Input
          addonBefore="Branch"
          placeholder="Enter branch"
          onChange={(data) => {
            setBranch(data.target.value);
          }}
        />
        <Input
          addonBefore="Section"
          placeholder="Enter section"
          onChange={(data) => {
            setSection(data.target.value);
          }}
        />
      </Space>
    </Modal>
  );
};

export default AddStudents;
