import React from "react";
import { Input, Modal, Space, Tabs, TabsProps, UploadProps } from "antd";
import { message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

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
  const [tab, setTab] = React.useState("1");

  function handleChangeTab(key: string) {
    setTab(key);
  }

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Single`,
      children: (
        <AddFacultySingle
          setBranchID={setBranchID}
          setDesignation={setDesignation}
          setEmail={setEmail}
          setFacultyType={setFacultyType}
          setName={setName}
        />
      ),
    },
    {
      key: "2",
      label: `Multiple`,
      children: <AddFacultyMultiple />,
    },
  ];

  return (
    <Modal
      title="Add Faculty"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Tabs activeKey={tab} items={items} onChange={handleChangeTab} />
    </Modal>
  );
};

export default AddFaculty;

const AddFacultySingle: React.FC<{
  setBranchID: Function;
  setDesignation: Function;
  setEmail: Function;
  setFacultyType: Function;
  setName: Function;
}> = ({ setBranchID, setDesignation, setEmail, setFacultyType, setName }) => {
  return (
    <Space
      direction="vertical"
      style={{
        width: "100%",
      }}
    >
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
  );
};

const props: UploadProps = {
  name: "file",
  multiple: false,
  accept: ".csv",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const AddFacultyMultiple: React.FC = () => {
  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single file upload. Do not upload any private data.
      </p>
    </Dragger>
  );
};
