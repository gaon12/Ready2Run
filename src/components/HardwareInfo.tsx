import { List, Card } from 'antd';
import {
  CodeOutlined,
  RocketOutlined,
  HddOutlined,
  DesktopOutlined,
  WifiOutlined,
  KeyOutlined,
} from '@ant-design/icons';

const data = [
  {
    title: 'CPU',
    description: 'Intel(R) Core(TM) i7-8750H CPU @ 2.20GHz',
    icon: <CodeOutlined />,
  },
  {
    title: 'RAM',
    description: '16.0 GB',
    icon: <RocketOutlined />,
  },
  {
    title: 'Storage',
    description: 'Samsung SSD 970 EVO Plus 500GB',
    icon: <HddOutlined />,
  },
  {
    title: 'GPU',
    description: 'NVIDIA GeForce GTX 1060',
    icon: <DesktopOutlined />,
  },
  {
    title: 'Network',
    description: 'Intel(R) Wireless-AC 9560 160MHz',
    icon: <WifiOutlined />,
  },
  {
    title: 'TPM',
    description: 'Enabled',
    icon: <KeyOutlined />,
  },
];

const HardwareInfo = () => (
  <Card title="하드웨어 정보">
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
  </Card>
);

export default HardwareInfo;