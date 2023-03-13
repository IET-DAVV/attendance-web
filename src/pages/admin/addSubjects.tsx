import React, { useState } from "react";
import { Input, Modal, Space } from "antd";

const AddSubjects: React.FC<{
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
}> = ({ isModalOpen, handleOk, handleCancel }) => {
  return (
    <Modal
      title="Basic Modal"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Space direction="vertical">
        <Input addonBefore="SubjectCode" placeholder="Enter subject code" />
        <Input addonBefore="SubjectName" placeholder="Enter subject name" />
        <Input addonBefore="Semester" placeholder="Enter semester" />
      </Space>
    </Modal>
  );
};

export default AddSubjects;
