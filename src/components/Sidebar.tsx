import React from "react";
/* Ant Design 컴포넌트 임포트 */
import { Layout, Menu, Tooltip } from "antd";
/* Ant Design Menu 타입 임포트 */
import type { MenuProps } from "antd";
/* Ant Design 아이콘 임포트 */
import {
  PlaySquareOutlined,
  LaptopOutlined,
  CodeOutlined,
  GithubOutlined,
  SettingOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
/* styled-components 임포트 */
import styled from "styled-components";

/**
 * Ant Design Menu의 items 타입 유틸
 * - AntD에서 제공하는 타입을 그대로 재사용합니다.
 */
type MenuItem = Required<MenuProps>["items"][number];

/* Layout.Sider 별칭 */
const { Sider } = Layout;

/* -------------------------------------------------------------------------- */
/*                                   상수                                     */
/* -------------------------------------------------------------------------- */

/**
 * 요구사항: 아이콘 크기 10% 축소
 * - 기존 24px → 21.6px
 * - 소수점 픽셀도 CSS에서 허용됨
 */
const ICON_SIZE = "21.6px";

/* -------------------------------------------------------------------------- */
/*                             styled-components                               */
/* -------------------------------------------------------------------------- */

/**
 * 사이드바 자체 스타일
 * - 배경색, 우측 보더, 고정 너비, 전체 높이(min-height: 100vh) 등을 지정
 * - AntD의 Sider는 내부에 .ant-layout-sider-children 래퍼를 자동 생성
 *   → 실제 레이아웃 분리는 우리가 만든 내부 래퍼에서 처리한다.
 */
const StyledSider = styled(Sider)`
  /* 고정 너비는 props로도 설정 가능하지만, 이곳에서 가시적으로 확인하기 위해 중복 표기 */
  width: 70px !important;
  min-width: 70px !important;
  max-width: 70px !important;

  /* 배경과 보더 */
  background: #f0f5ff !important; /* 연한 블루 배경 */
  border-right: 1px solid #e5e7eb;

  /* 뷰포트 높이만큼 확보하여 하단 고정이 안정적으로 보이도록 함 */
  min-height: 100vh;

  /* Sider 자체는 굳이 flex일 필요 없음(내부 래퍼에서 flex 처리) */
`;

/**
 * 사이드바 내부 래퍼
 * - 실제로 상단(로고, 상단 메뉴) / 스페이서 / 하단(하단 메뉴)을 배치하는 컨테이너
 * - 세로 플렉스 레이아웃으로 설정하고, 높이를 100%로 맞춰야 스페이서가 정상 동작
 */
const SidebarInner = styled.div`
  display: flex;
  flex-direction: column;   /* 상/하 배치 */
  align-items: center;      /* 수평 중앙 정렬 */
  height: 100%;             /* Sider의 내부 높이를 가득 채움 */
`;

/**
 * 로고 영역 스타일
 * - 실제 로고 이미지 사용 시, <img src="..." />로 교체 가능
 * - 사이드바 너비(70px)에 맞춰 박스를 중앙 정렬
 */
const LogoBox = styled.div`
  width: 70px;
  height: 64px;             /* 로고 영역 높이(필요 시 조절) */
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * 상단 메뉴 스타일
 * - inlineCollapsed 상태에서 아이콘만 보이도록 타이틀 텍스트 숨김
 * - 메뉴 아이템 간 약간의 세로 간격(margin) 부여
 * - 좌우 보더 제거(좁은 사이드바에서 깔끔하게 보이도록)
 */
const StyledMenuTop = styled(Menu)`
  width: 70px;
  background: transparent !important;
  border-inline-end: 0 !important;
  align-self: stretch; /* 가로폭을 래퍼 너비에 맞춤 */

  /* 아이템 간 간격과 높이 조정 */
  .ant-menu-item {
    margin: 6px 0 !important; /* 상단 메뉴: '약간' 띄우기 */
    height: 40px;
    line-height: 40px;
  }

  /* inlineCollapsed에서 텍스트 숨김(아이콘만 보이게) */
  .ant-menu-title-content {
    display: none;
  }
`;

/**
 * 하단 메뉴 스타일
 * - 하단에 고정 배치되도록 별도의 컴포넌트로 분리
 * - 선택 하이라이트가 필요 없으면 selectedKeys를 빈 배열로 유지
 */
const StyledMenuBottom = styled(Menu)`
  width: 70px;
  background: transparent !important;
  border-inline-end: 0 !important;
  align-self: stretch;   /* 가로폭을 래퍼 너비에 맞춤 */
  flex: 0 0 auto;        /* 고정 크기(위로 밀리지 않도록) */

  /* 하단 메뉴 아이템 간 간격 */
  .ant-menu-item {
    margin: 4px 0;
  }

  /* inlineCollapsed에서 텍스트 숨김(아이콘만 보이게) */
  .ant-menu-title-content {
    display: none;
  }
`;

/**
 * 상/하단 메뉴를 분리하는 스페이서
 * - 남는 공간을 모두 차지하여 하단 메뉴를 바닥으로 밀어냄
 * - min-height: 0 지정으로 플렉스 컨테이너 내에서 안정적으로 수축 가능
 */
const Spacer = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
`;

/* -------------------------------------------------------------------------- */
/*                         상단/하단 메뉴 "데이터" 분리                         */
/* -------------------------------------------------------------------------- */

/**
 * 상단(메인) 메뉴 아이템 목록
 * - 실행 / 하드웨어 / 소프트웨어
 * - 각 아이콘은 10% 축소(21.6px)
 * - inlineCollapsed에서 items의 title 속성이 툴팁으로 사용됨
 */
const TOP_MENU_ITEMS: MenuItem[] = [
  {
    key: "execution",
    label: "실행",
    title: "실행",
    icon: <PlaySquareOutlined style={{ fontSize: ICON_SIZE }} />,
  },
  {
    key: "hardware",
    label: "하드웨어",
    title: "하드웨어",
    icon: <LaptopOutlined style={{ fontSize: ICON_SIZE }} />,
  },
  {
    key: "software",
    label: "소프트웨어",
    title: "소프트웨어",
    icon: <CodeOutlined style={{ fontSize: ICON_SIZE }} />,
  },
];

/**
 * 하단(보조) 메뉴 아이템 목록
 * - 깃허브 / 설정
 * - 각 아이콘은 10% 축소(21.6px)
 */
const BOTTOM_MENU_ITEMS: MenuItem[] = [
  {
    key: "github",
    label: "깃허브",
    title: "깃허브",
    icon: <GithubOutlined style={{ fontSize: ICON_SIZE }} />,
  },
  {
    key: "settings",
    label: "설정",
    title: "설정",
    icon: <SettingOutlined style={{ fontSize: ICON_SIZE }} />,
  },
];

/* -------------------------------------------------------------------------- */
/*                              하위 컴포넌트 분리                              */
/* -------------------------------------------------------------------------- */

/**
 * 상단 메뉴 전용 컴포넌트
 * - 상단에 표시할 메뉴만 렌더링
 * - selectedKeys로 현재 선택 상태를 상단에서만 표시
 */
interface SidebarTopMenuProps {
  selected: string;              /* 현재 선택된 메뉴 키 */
  onSelect: (k: string) => void; /* 선택 변경 콜백 */
}

const SidebarTopMenu: React.FC<SidebarTopMenuProps> = ({ selected, onSelect }) => {
  return (
    <StyledMenuTop
      mode="inline"              /* 세로 방향 메뉴 */
      inlineCollapsed            /* 접힌 상태: 아이콘만 보임, title이 툴팁으로 노출 */
      inlineIndent={0}           /* 들여쓰기 제거(가로폭 70px에서 중앙 정렬 효과) */
      selectedKeys={[selected]}  /* 상단 메뉴에서만 선택 하이라이트 */
      onClick={(e) => onSelect(String(e.key))}
      items={TOP_MENU_ITEMS}
    />
  );
};

/**
 * 하단 메뉴 전용 컴포넌트
 * - 하단에 표시할 메뉴만 렌더링
 * - 선택 하이라이트가 필요 없다면 selectedKeys를 빈 배열로 둔다.
 */
interface SidebarBottomMenuProps {
  onSelect: (k: string) => void; /* 클릭 시 키 전달 */
}

const SidebarBottomMenu: React.FC<SidebarBottomMenuProps> = ({ onSelect }) => {
  return (
    <StyledMenuBottom
      mode="inline"
      inlineCollapsed
      inlineIndent={0}
      selectedKeys={[]}           /* 하이라이트 없이 클릭만 처리 */
      onClick={(e) => onSelect(String(e.key))}
      items={BOTTOM_MENU_ITEMS}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*                                메인 컴포넌트                                 */
/* -------------------------------------------------------------------------- */

/**
 * Sidebar 컴포넌트
 *
 * 구현 포인트 요약:
 *  1) StyledSider 안쪽에 SidebarInner(직접 래퍼)를 두어 flex column 레이아웃을 구성
 *  2) 상단(로고, 상단 메뉴) - Spacer - 하단(하단 메뉴) 순으로 배치
 *  3) Spacer가 남는 공간을 차지하여 하단 메뉴를 바닥에 고정
 *  4) 아이콘 10% 축소, 상단 메뉴 아이템 간 간격 추가
 */
interface SidebarProps {
  selected: string;              /* 상단 메뉴 선택 키 */
  onSelect: (k: string) => void; /* 메뉴 클릭 시 상위로 선택 키 전달 */
}

const Sidebar: React.FC<SidebarProps> = ({ selected, onSelect }) => {
  return (
    <StyledSider width={70}>
      {/* 실제 레이아웃을 담당하는 사용자 정의 래퍼 */}
      <SidebarInner>
        {/* 로고 영역: 필요 시 AppstoreOutlined → 서비스 로고 이미지로 교체 */}
        <Tooltip title="로고" placement="right">
          <LogoBox aria-label="로고" role="img">
            <AppstoreOutlined style={{ fontSize: "22px", color: "#3b82f6" }} />
          </LogoBox>
        </Tooltip>

        {/* 상단 메뉴 */}
        <SidebarTopMenu selected={selected} onSelect={onSelect} />

        {/* 상/하단 분리 스페이서: 남은 공간을 차지하여 하단을 바닥으로 밀어냄 */}
        <Spacer />

        {/* 하단 메뉴 */}
        <SidebarBottomMenu onSelect={onSelect} />
      </SidebarInner>
    </StyledSider>
  );
};

export default Sidebar;
