import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import {
  PlaySquareOutlined,
  LaptopOutlined,
  CodeOutlined,
  GithubOutlined,
  SettingOutlined,
} from "@ant-design/icons";

type MenuItem = Required<MenuProps>["items"][number];

/**
 * 메뉴 아이템을 생성하는 헬퍼 함수
 * - label: 항목의 텍스트(선택 상태나 접근성에 사용)
 * - key: 항목 고유 키
 * - icon: 아이콘 컴포넌트
 * - children: 하위 메뉴(필요 시)
 * - type: 'group' 등 메뉴 타입(필요 시)
 * - title: 툴팁으로 표시될 문자열(메뉴가 접힌 상태일 때 사용됨)
 *
 * 주의:
 *  - Menu가 inline + inlineCollapsed=true일 때, 각 아이템의 title이 툴팁으로 노출됩니다.
 */
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group",
  title?: string
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
    // title을 지정하면 inlineCollapsed=true에서 툴팁으로 사용됩니다.
    ...(title ? { title } : {}),
  } as MenuItem;
}

/**
 * 상단(메인) 메뉴 아이템 목록
 * - 화면에서는 아이콘만 보이고, 마우스오버 시 title(=메뉴명)이 툴팁으로 출력됩니다.
 */
const topMenuItems: MenuItem[] = [
  getItem("실행", "execution", <PlaySquareOutlined />, undefined, undefined, "실행"),
  getItem("하드웨어", "hardware", <LaptopOutlined />, undefined, undefined, "하드웨어"),
  getItem("소프트웨어", "software", <CodeOutlined />, undefined, undefined, "소프트웨어"),
];

/**
 * 하단(보조) 메뉴 아이템 목록
 * - 요청사항대로 '깃허브', '설정'을 하단으로 배치합니다.
 * - 동일하게 툴팁(title)을 제공합니다.
 */
const bottomMenuItems: MenuItem[] = [
  getItem("깃허브", "github", <GithubOutlined />, undefined, undefined, "깃허브"),
  getItem("설정", "settings", <SettingOutlined />, undefined, undefined, "설정"),
];

const { Sider } = Layout;

interface SidebarProps {
  // 현재 선택된 메뉴 키
  selected: string;
  // 메뉴 클릭 시 상위로 선택 키를 전달하는 콜백
  onSelect: (k: string) => void;
}

const Sidebar = ({ selected, onSelect }: SidebarProps) => {
  return (
    <Sider
      // 사이드바의 고정 너비
      width={70}
      // 배경/보더/레이아웃 속성 설정
      style={{
        background: "#f0f5ff", // 연한 블루 계열 배경색
        borderRight: "1px solid #e5e7eb", // 우측 보더(구분선)
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* 상단 메뉴
          - mode="inline": 세로형 메뉴
          - inlineCollapsed: true => 아이콘만 보이고, 각 아이템의 title이 툴팁으로 표시됩니다.
          - inlineIndent: 0 => 좌측 들여쓰기 제거(좁은 너비에서 중앙 정렬 효과)
      */}
      <Menu
        mode="inline"
        inlineCollapsed
        inlineIndent={0}
        selectedKeys={[selected]} // 현재 선택된 키를 배열로 전달
        onClick={(e) => onSelect(String(e.key))} // 클릭 시 선택 키 상향 전달
        items={topMenuItems} // items prop 사용
        style={{ width: 70, borderInlineEnd: 0, background: "transparent" }}
      />

      {/* 가변 여백: 상/하단 메뉴를 위아래로 분리 */}
      <div style={{ flex: 1 }} />

      {/* 하단 메뉴
          - 선택 하이라이트를 표시하지 않으려면 selectedKeys를 빈 배열로 둡니다.
          - inlineCollapsed=true로 동일하게 툴팁 제공
      */}
      <Menu
        mode="inline"
        inlineCollapsed
        inlineIndent={0}
        selectedKeys={[]}
        style={{ width: 70, borderInlineEnd: 0, background: "transparent" }}
        onClick={(e) => onSelect(String(e.key))} // 필요 시 하단 클릭도 상향 전달
        items={bottomMenuItems} // items prop 사용
      />
    </Sider>
  );
};

export default Sidebar;
