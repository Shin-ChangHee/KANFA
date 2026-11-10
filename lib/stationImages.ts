// 코스 구간별 동작 그림. 그림이 없는 구간은 글만 보여준다.
import type { StaticImageData } from "next/image";
import agility from "@/assets/stations/agility.webp";
import flexibility from "@/assets/stations/flexibility.webp";
import grip from "@/assets/stations/grip.webp";
import shuttleRun from "@/assets/stations/shuttle-run.webp";
import situp from "@/assets/stations/situp.webp";

export interface StationImage {
  src: StaticImageData;
  alt: string;
}

/** 원래 측정항목 이름으로 찾는다. 성인·어르신 코스가 같은 측정항목이면 같은 그림을 쓴다. */
const BY_SOURCE_TEST: Record<string, StationImage> = {
  "20m 왕복오래달리기": { src: shuttleRun, alt: "체육관에서 출발선과 20m 떨어진 반환점 사이를 오가며 달리는 모습" },
  상대악력: { src: grip, alt: "한 손으로 디지털 악력계를 힘껏 쥐고 있는 모습" },
  교차윗몸일으키기: { src: situp, alt: "매트에 누워 무릎을 세우고 상체를 일으켜 팔꿈치를 반대쪽 무릎에 대는 세 동작" },
  "10m 4회 왕복달리기": { src: agility, alt: "달려가서 몸을 낮춰 바닥 표시를 손으로 짚고 방향을 바꿔 다시 달리는 세 동작" },
  앉아윗몸앞으로굽히기: { src: flexibility, alt: "다리를 펴고 앉아 두 손을 모아 측정기를 앞으로 천천히 미는 세 동작" },
};

export function stationImage(sourceTest: string): StationImage | undefined {
  return BY_SOURCE_TEST[sourceTest];
}
