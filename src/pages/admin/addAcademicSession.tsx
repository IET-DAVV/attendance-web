import React, { useEffect, useState } from "react";
import { Input, Layout, Modal, Select, Space } from "antd";

const AddAcademicSession: React.FC<{
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  setAcademicSession: Function;
  editMode?: boolean;
  selectedAcademicSession?: string;
}> = ({
  isModalOpen,
  handleOk,
  handleCancel,
  setAcademicSession,
  editMode,
  selectedAcademicSession,
}) => {
  return (
    <Modal
      title="Add Academic Session"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Space direction="vertical">
        <Input
          addonBefore="Academic Session"
          placeholder="Ex. 2022_2023_1"
          value={selectedAcademicSession}
          onChange={(data) => {
            setAcademicSession(data.target.value);
          }}
        />
      </Space>
    </Modal>
  );
};

export default AddAcademicSession;
