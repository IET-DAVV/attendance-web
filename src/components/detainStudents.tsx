import React from "react";
import { Modal, Select, Space } from "antd";

const AddSubjects: React.FC<{
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  setExam: Function;
  students: Number;
}> = ({ isModalOpen, handleOk, handleCancel, setExam, students }) => {
  return (
    <Modal
      title="Detain Students"
      open={isModalOpen}
      onOk={handleOk}
      okText="Yes, Detain"
      okButtonProps={{ danger: true }}
      onCancel={handleCancel}
    >
      <Space direction="vertical">
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
              ExamType
            </h4>
            <Select
              style={{ width: 200 }}
              placeholder="Select exam type"
              allowClear
              options={[
                { value: "mst1", label: "MST 1" },
                { value: "mst2", label: "MST 2" },
                { value: "mst3", label: "MST 3" },
                { value: "endSem", label: "END SEM" },
              ]}
              onChange={(data) => {
                setExam(data);
              }}
            />
          </div>
          {`Total Students : ${students}`}
        </>
      </Space>
    </Modal>
  );
};

export default AddSubjects;
