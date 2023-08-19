import React, { useEffect, useState } from "react";
import { Input, Modal, Select, Space } from "antd";
import { IClass } from "@/utils/interfaces";
import { useGlobalContext } from "@/utils/context/GlobalContext";

const { Option } = Select;

const SECTION_OPTIONS = ["A", "B", "NA"];

const AddClass: React.FC<{
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  setClassData: (data: IClass) => void;
  classData: IClass;
  editMode?: boolean;
}> = ({
  isModalOpen,
  handleOk,
  handleCancel,
  setClassData,
  editMode,
  classData,
}) => {
  const [enrollmentYear, setEnrollmentYear] = useState<string>("");
  const [branch, setBranch] = useState<string>("");
  const [section, setSection] = useState<string>("");
  const [enrollmentYears, setEnrollmentYears] = useState<number[]>([]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 1996; i <= currentYear; i++) {
      years.push(i);
    }
    setEnrollmentYears(years);
  }, []);

  const { branches } = useGlobalContext();

  useEffect(() => {
    console.log({ classData, editMode });
    if (editMode && classData.id) {
      const [enrollmentYear, branch, section] = classData.id.split("_");
      setEnrollmentYear(enrollmentYear);
      setBranch(branch);
      setSection(section);
    }
  }, [editMode, classData]);

  useEffect(() => {
    if (enrollmentYear && branch && section) {
      setClassData({
        id: `${enrollmentYear}_${branch}_${section}`,
        createdAt: editMode ? classData.createdAt : Date.now(),
        modifiedAt: Date.now(),
      });
    }
  }, [enrollmentYear, branch, section]);

  return (
    <Modal
      title={editMode ? "Edit Class" : "Add Class"}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Space direction="horizontal">
        <Select
          placeholder="Enrollment Year"
          value={enrollmentYear || undefined}
          onChange={(value) => setEnrollmentYear(value)}
          showSearch
        >
          {enrollmentYears.map((year) => (
            <Option key={year} value={year}>
              {year}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Select Branch"
          value={branch || undefined}
          onChange={(value) => setBranch(value)}
          showSearch
        >
          {branches.map((branch) => (
            <Option key={branch.branchID} value={branch.branchID}>
              {branch.branchName}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Select Section"
          value={section || undefined}
          onChange={(value) => setSection(value)}
          showSearch
        >
          {SECTION_OPTIONS.map((section) => (
            <Option key={section} value={section}>
              {section}
            </Option>
          ))}
        </Select>
      </Space>
    </Modal>
  );
};

export default AddClass;
