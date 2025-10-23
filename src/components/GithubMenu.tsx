import { Menu } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import { openUrl } from '@tauri-apps/plugin-opener';

const GithubMenu = () => {
  const githubRepo = import.meta.env.VITE_GITHUB_REPO;

  const handleClick = () => {
    if (githubRepo) {
      openUrl(`https://github.com/${githubRepo}`);
    }
  };

  return (
    <Menu.Item key="github" icon={<GithubOutlined />} onClick={handleClick}>
      깃허브
    </Menu.Item>
  );
};

export default GithubMenu;
