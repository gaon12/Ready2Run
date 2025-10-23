
import { Menu } from "antd";
import { PlaySquareOutlined } from "@ant-design/icons";

const ExecutionMenu = () => {
  return (
    <Menu.Item key="execution" icon={<PlaySquareOutlined />}>
      실행
    </Menu.Item>
  );
};

export default ExecutionMenu;
