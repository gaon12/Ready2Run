use sysinfo::{System, Disks, Networks, Motherboard}; // 최신 API에 필요한 타입들만 임포트
// use tauri::Manager; // 필요 시만 사용하십시오(현재 예시에서는 불필요)

/// 프론트엔드로 전달할 하드웨어 정보 구조체
#[derive(serde::Serialize, Clone, Default)]
struct HardwareInfo {
    cpu: String,         // CPU 모델 및 코어 수(논리/물리)
    ram: String,         // 사용 RAM / 총 RAM (GB 단위)
    storage: String,     // 디스크별 사용량 / 총 용량 (GB), 줄바꿈으로 구분
    gpu: String,         // GPU 정보(본 예시에서는 수집하지 않음 → "N/A")
    network: String,     // 인터페이스별 송·수신 누적량(MB), 줄바꿈으로 구분
    tpm: String,         // TPM 정보(본 예시에서는 수집하지 않음 → "N/A")
    motherboard: String, // 메인보드 벤더/모델/버전
}

/// 하드웨어 정보를 수집하여 직렬화 가능한 형태로 반환하는 Tauri 커맨드
#[tauri::command]
fn get_hardware_info() -> HardwareInfo {
    // System 인스턴스를 만들고 모든 정보를 갱신합니다.
    // new_all()은 가능한 정보를 미리 적재하고, refresh_all()은 전범위 갱신을 수행합니다.
    let mut sys = System::new_all();
    sys.refresh_all();

    // -----------------------------
    // 1) CPU 정보
    // -----------------------------
    // 브랜드/이름은 환경에 따라 global_cpu_info().brand()가 빈 문자열일 수 있으므로
    // 첫 번째 CPU 항목의 brand()를 우선 사용하고, 빈 경우 name()으로 대체합니다.
    let cpu_brand_or_name = sys
        .cpus()
        .first()
        .map(|c| {
            let b = c.brand();
            if b.is_empty() { c.name() } else { b }
        })
        .unwrap_or("Unknown CPU");

    // 논리 코어 수: CPU 벡터 길이
    let logical = sys.cpus().len();

    // 물리 코어 수: 최신 버전에서는 연관 함수로 제공합니다.
    // 값이 없으면 논리 코어 수로 대체합니다.
    let physical = System::physical_core_count().unwrap_or(logical);

    let cpu = format!(
        "{} (logical: {}, physical: {})",
        cpu_brand_or_name, logical, physical
    );

    // -----------------------------
    // 2) 메모리 정보
    // -----------------------------
    // sysinfo 최신 문서에서 total/used/available/free 메모리는 모두 "바이트 단위"입니다.
    // 보기 좋은 GB 단위(2의 거듭제곱, 1024^3)로 변환해 표기합니다.
    let to_gb = |bytes: u64| (bytes as f64) / 1_073_741_824.0; // 1024^3
    let ram = format!(
        "{:.2} GB / {:.2} GB",
        to_gb(sys.used_memory()),
        to_gb(sys.total_memory())
    );

    // -----------------------------
    // 3) 디스크(스토리지) 정보
    // -----------------------------
    // Disks 컬렉션을 생성하여 목록을 순회합니다.
    // 각 Disk의 name()/file_system()/total_space()/available_space()를 사용합니다.
    // name()/file_system()은 OsStr를 반환할 수 있으므로 to_string_lossy()로 문자열화합니다.
    let disks = Disks::new_with_refreshed_list();
    let storage = disks
        .list()
        .iter()
        .map(|disk| {
            // 디스크 이름 및 파일시스템 타입 문자열화
            let name = disk.name().to_string_lossy();
            let fs = disk.file_system().to_string_lossy();

            // 사용량 = total_space - available_space (언더플로우 방지 위해 saturating_sub 사용 권장)
            let total = disk.total_space();
            let avail = disk.available_space();
            let used = total.saturating_sub(avail);

            format!(
                "{} ({}) - {:.2} GB / {:.2} GB",
                name, fs, to_gb(used), to_gb(total)
            )
        })
        .collect::<Vec<_>>()
        .join("\n");

    // -----------------------------
    // 4) 네트워크 트래픽 정보
    // -----------------------------
    // Networks 컬렉션을 생성해 인터페이스별 누적 송/수신량을 조회합니다.
    // total_transmitted()/total_received()는 바이트 단위이므로, MB(1024^2)로 변환합니다.
    let networks = Networks::new_with_refreshed_list();
    let to_mb = |bytes: u64| (bytes as f64) / 1_048_576.0; // 1024^2

    // HashMap<String, NetworkData>에 대한 참조로 순회 가능합니다.
    let network = networks
        .iter()
        .map(|(iface, data)| {
            format!(
                "{}: Sent {:.2} MB, Received {:.2} MB",
                iface,
                to_mb(data.total_transmitted()),
                to_mb(data.total_received())
            )
        })
        .collect::<Vec<_>>()
        .join("\n");

    // -----------------------------
    // 5) 메인보드 정보(Motherboard)
    // -----------------------------
    // 0.36.0에서 추가된 Motherboard 타입을 사용하여 벤더/모델/버전을 얻습니다.
    // 플랫폼에 따라 None일 수 있으므로 안전하게 처리합니다.
    let motherboard = if let Some(mb) = Motherboard::new() {
        let vendor = mb.vendor_name().unwrap_or_else(|| "UnknownVendor".into());
        let name = mb.name().unwrap_or_else(|| "UnknownModel".into());
        let ver = mb.version().unwrap_or_else(|| "UnknownVersion".into());
        format!("{} {} ({})", vendor, name, ver)
    } else {
        "Unknown Motherboard".to_string()
    };

    // -----------------------------
    // 6) GPU/TPM
    // -----------------------------
    // sysinfo는 범용 GPU/TPM 조회 기능을 제공하지 않습니다.
    // 필요 시 OS/벤더별 라이브러리를 연동해야 합니다.
    let gpu = "N/A".to_string();
    let tpm = "N/A".to_string();

    // -----------------------------
    // 7) 구조체로 반환
    // -----------------------------
    HardwareInfo {
        cpu,
        ram,
        storage,
        gpu,
        network,
        tpm,
        motherboard,
    }
}

/// 간단한 인사 커맨드(원본 유지)
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Tauri 엔트리포인트(원본 유지)
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_hardware_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
