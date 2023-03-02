import { getDateDayMonthYear } from "@/utils/functions";
import { Button, Drawer, Space } from "antd";

const AddNewAttendance: React.FC<{
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}> = ({ open, onClose, children }) => {
  const today = getDateDayMonthYear(new Date());
  return (
    <Drawer
      title={"New Attendance " + `(${today.date} ${today.month})`}
      width={720}
      onClose={onClose}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onClose} type="primary">
            Submit
          </Button>
        </Space>
      }
    >
      {children}
    </Drawer>
  );
};

export default AddNewAttendance;
