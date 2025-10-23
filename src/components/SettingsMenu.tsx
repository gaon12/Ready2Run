import { Menu } from "antd";
import { SettingOutlined } from "@ant-design/icons";

const SettingsMenu = () => {
  return (
    <Menu.Item key="settings" icon={<SettingOutlined />}>
      설정
    </Menu.Item>
  );
};

export default SettingsMenu;
