import { useState } from "react";
import { openUrl } from "@tauri-apps/plugin-opener";
// Ant Design 컴포넌트와 아이콘을 사용합니다.
import {
  Layout,
  Card,
} from "antd";
// App.css 임포트
import "./App.css";

// 레이아웃 분해
const { Content } = Layout;

import Sidebar from "./components/Sidebar";

// ------------------------------------------------------------
// 메인 컴포넌트
// ------------------------------------------------------------

export default function AntdMessengerSidebarDemo() {
  // 사이드바 선택 상태(데모 목적)
  const [selected, setSelected] = useState("execution");
  const githubRepo = import.meta.env.VITE_GITHUB_REPO;

  const handleSelect = (key: string) => {
    if (key === 'github') {
      if (githubRepo) {
        openUrl(`https://github.com/${githubRepo}`);
      }
    } else {
      setSelected(key);
    }
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      {/* 앱 컨테이너 */}
      <Card
        styles={{ body: { padding: 0 } }}
        style={{ width: 520, height: 720, overflow: "hidden" }}
      >
        <Layout style={{ height: 720 }}>
          {/* 좌측 사이드바: 상단 3개, 하단 2개만 */}
          <Sidebar selected={selected} onSelect={handleSelect} />

          {/* 우측 컨텐트 영역 */}
          <Content style={{ display: "flex", flexDirection: "column" }}>
            {/* Conditionally rendered content based on selected menu item */}
            <div style={{ flex: 1, padding: 16 }}>
              {selected === "execution" && <h2 style={{ color: '#333' }}>실행 메뉴 내용</h2>}
              {selected === "hardware" && <h2 style={{ color: '#333' }}>하드웨어 메뉴 내용</h2>}
              {selected === "software" && <h2 style={{ color: '#333' }}>소프트웨어 메뉴 내용</h2>}
              {selected === "github" && <h2 style={{ color: '#333' }}>깃허브 메뉴 내용</h2>}
              {selected === "settings" && <h2 style={{ color: '#333' }}>설정 메뉴 내용</h2>}
            </div>
            </Content>
        </Layout>
      </Card>
    </div>
  );
}
