import React, { useEffect, useState } from "react";
import { Input, Layout, Modal, Select, Space } from "antd";

const AddAcademicSession: React.FC<{
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  setAcademicSession: Function;
  editMode?: boolean;
  selectedAcademicSession?: {
    academicSession: string;
    createdAt: number;
    modifiedAt: number;
  };
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
          value={selectedAcademicSession?.academicSession}
          onChange={(event) => {
            setAcademicSession({
              academicSession: event.target.value,
              createdAt: Date.now(),
              modifiedAt: Date.now(),
            });
          }}
        />
      </Space>
    </Modal>
  );
};

export default AddAcademicSession;
