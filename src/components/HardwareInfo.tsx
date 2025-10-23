import { List, Card, Skeleton } from 'antd';
import {
  CodeOutlined,
  DatabaseOutlined,
  RocketOutlined,
  HddOutlined,
  DesktopOutlined,
  WifiOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import useHardwareStore from '../stores/hardwareStore';

const HardwareInfo = () => {
  const { hardwareInfo, loading } = useHardwareStore();

  const data = hardwareInfo ? [
    {
      title: 'CPU',
      description: hardwareInfo.cpu,
      icon: <CodeOutlined />,
    },
    {
      title: '메인보드',
      description: hardwareInfo.motherboard,
      icon: <DatabaseOutlined />,
    },
    {
      title: 'RAM',
      description: hardwareInfo.ram,
      icon: <RocketOutlined />,
    },
    {
      title: 'Storage',
      description: hardwareInfo.storage,
      icon: <HddOutlined />,
    },
    {
      title: 'GPU',
      description: hardwareInfo.gpu,
      icon: <DesktopOutlined />,
    },
    {
      title: 'Network',
      description: hardwareInfo.network,
      icon: <WifiOutlined />,
    },
    {
      title: 'TPM',
      description: hardwareInfo.tpm,
      icon: <KeyOutlined />,
    },
  ] : [];

  return (
    <Card title="하드웨어 정보">
      {loading ? (
        <Skeleton active />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={item.icon}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default HardwareInfo;
