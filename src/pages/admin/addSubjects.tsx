import React, { useState } from "react";
import { Input, Layout, Modal, Select, Space } from "antd";

const AddSubjects: React.FC<{
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
}> = ({ isModalOpen, handleOk, handleCancel }) => {
  return (
    <Modal
      title="Add Subject"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Space direction="vertical">
        <Input addonBefore="Subject Code" placeholder="Enter subject code" />
        <Input addonBefore="Subject Name" placeholder="Enter subject name" />
        <>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <h4
              style={{
                backgroundColor: "#FAFAFA",
                fontWeight: "normal",
                padding: 4,
                paddingLeft: 10,
                paddingRight: 10,
                borderTopLeftRadius: 6,
                borderBottomLeftRadius: 6,
                alignSelf: "center",
                border: "1px solid #D9D9D9",
              }}
            >
              Semester
            </h4>
            <Select
              style={{ width: 200 }}
              placeholder="Select semester"
              allowClear
              options={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
                { value: "4", label: "4" },
                { value: "5", label: "5" },
                { value: "6", label: "6" },
                { value: "7", label: "7" },
                { value: "8", label: "8" },
              ]}
            />
          </div>
        </>
      </Space>
    </Modal>
  );
};

export default AddSubjects;
