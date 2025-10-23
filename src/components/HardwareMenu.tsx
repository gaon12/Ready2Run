
import { Menu } from "antd";
import { LaptopOutlined } from "@ant-design/icons";

const HardwareMenu = () => {
  return (
    <Menu.Item key="hardware" icon={<LaptopOutlined />}>
      하드웨어
    </Menu.Item>
  );
};

export default HardwareMenu;
