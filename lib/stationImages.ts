// 코스 구간별 동작 그림. 그림이 없는 구간은 글만 보여준다.
import type { StaticImageData } from "next/image";
import agility from "@/assets/stations/agility.webp";
import flexibility from "@/assets/stations/flexibility.webp";
import grip from "@/assets/stations/grip.webp";
import longJump from "@/assets/stations/long-jump.webp";
import seniorChairStand from "@/assets/stations/senior-chair-stand.webp";
import seniorChairWalk from "@/assets/stations/senior-chair-walk.webp";
import seniorFigure8 from "@/assets/stations/senior-figure8.webp";
import seniorGrip from "@/assets/stations/senior-grip.webp";
import seniorStep from "@/assets/stations/senior-step.webp";
import shuttleRun from "@/assets/stations/shuttle-run.webp";
import situp from "@/assets/stations/situp.webp";
import type { CourseType } from "./types";

export interface StationImage {
  src: StaticImageData;
  alt: string;
}

const FLEXIBILITY: StationImage = { src: flexibility, alt: "다리를 펴고 앉아 두 손을 모아 측정기를 앞으로 천천히 미는 세 동작" };

/** 코스별로 원래 측정항목 이름으로 찾는다. */
const IMAGES: Record<CourseType, Record<string, StationImage>> = {
  adult: {
    "20m 왕복오래달리기": { src: shuttleRun, alt: "체육관에서 출발선과 20m 떨어진 반환점 사이를 오가며 달리는 모습" },
    상대악력: { src: grip, alt: "한 손으로 디지털 악력계를 힘껏 쥐고 있는 모습" },
    교차윗몸일으키기: { src: situp, alt: "매트에 누워 무릎을 세우고 상체를 일으켜 팔꿈치를 반대쪽 무릎에 대는 세 동작" },
    제자리멀리뛰기: { src: longJump, alt: "출발선에서 무릎을 굽혔다가 앞으로 힘껏 뛰어 센서 매트 위에 착지하는 세 동작" },
    "10m 4회 왕복달리기": { src: agility, alt: "달려가서 몸을 낮춰 바닥 표시를 손으로 짚고 방향을 바꿔 다시 달리는 세 동작" },
    앉아윗몸앞으로굽히기: FLEXIBILITY,
  },
  senior: {
    "2분 제자리 걷기": { src: seniorStep, alt: "어르신이 손잡이 옆에서 오른쪽 무릎을 높이 올리며 제자리 걷기를 하는 모습. 오른발이 올라갈 때 1보로 센다" },
    상대악력: { src: seniorGrip, alt: "어르신이 양손에 디지털 악력계를 쥐고 있는 모습" },
    "30초 의자에 앉았다 일어서기": { src: seniorChairStand, alt: "어르신이 팔을 가슴 앞에 모으고 의자에 앉았다가 완전히 일어서는 세 동작" },
    "의자에 앉아 3m 표적 돌아오기": { src: seniorChairWalk, alt: "어르신이 의자에서 일어나 3m 앞 표적까지 걸어갔다가 의자로 돌아오는 세 동작" },
    "8자 보행": { src: seniorFigure8, alt: "어르신이 의자에서 일어나 바닥의 두 표적 사이를 숫자 8 모양으로 걸어 돌아오는 길을 점선으로 나타낸 그림" },
    // 어르신 그림을 아직 받지 못해 성인 코스와 같은 그림을 쓴다.
    앉아윗몸앞으로굽히기: FLEXIBILITY,
  },
};

export function stationImage(course: CourseType, sourceTest: string): StationImage | undefined {
  return IMAGES[course][sourceTest];
}
