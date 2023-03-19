import React, { useEffect, useState } from "react";
import { Input, Layout, Modal, Select, Space } from "antd";

const AddSubjects: React.FC<{
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  setSemester: Function;
  setSubjectCode: Function;
  setSubjectName: Function;
}> = ({
  isModalOpen,
  handleOk,
  handleCancel,
  setSemester,
  setSubjectCode,
  setSubjectName,
}) => {
  return (
    <Modal
      title="Add Subject"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Space direction="vertical">
        <Input
          addonBefore="Subject Code"
          placeholder="Enter subject code"
          onChange={(data) => {
            setSubjectCode(data.target.value);
          }}
        />
        <Input
          addonBefore="Subject Name"
          placeholder="Enter subject name"
          onChange={(data) => {
            setSubjectName(data.target.value);
          }}
        />
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
              onChange={(data) => {
                setSemester(data);
              }}
            />
          </div>
        </>
      </Space>
    </Modal>
  );
};

export default AddSubjects;
