
import { Menu } from "antd";
import { CodeOutlined } from "@ant-design/icons";

const SoftwareMenu = () => {
  return (
    <Menu.Item key="software" icon={<CodeOutlined />}>
      소프트웨어
    </Menu.Item>
  );
};

export default SoftwareMenu;
