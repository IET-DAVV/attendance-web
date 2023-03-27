import React from "react";
import { Input, Modal, Select, Space } from "antd";

const AddFaculty: React.FC<{
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  setBranchID: Function;
  setDesignation: Function;
  setEmail: Function;
  setFacultyType: Function;
  setName: Function;
}> = ({
  isModalOpen,
  handleOk,
  handleCancel,
  setBranchID,
  setDesignation,
  setEmail,
  setFacultyType,
  setName,
}) => {
  return (
    <Modal
      title="Add Faculty"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Space direction="vertical">
        <Input
          addonBefore="Branch ID"
          placeholder="Enter branch id"
          onChange={(data) => {
            setBranchID(data.target.value);
          }}
        />
        <Input
          addonBefore="Designation"
          placeholder="Enter designation"
          onChange={(data) => {
            setDesignation(data.target.value);
          }}
        />
        <Input
          addonBefore="Email"
          placeholder="Enter email"
          onChange={(data) => {
            setEmail(data.target.value);
          }}
        />
        <Input
          addonBefore="Faculty Type"
          placeholder="Enter faculty type"
          onChange={(data) => {
            setFacultyType(data.target.value);
          }}
        />
        <Input
          addonBefore="Name"
          placeholder="Enter name"
          onChange={(data) => {
            setName(data.target.value);
          }}
        />
      </Space>
    </Modal>
  );
};

export default AddFaculty;
