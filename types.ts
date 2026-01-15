
export type Gender = '男' | '女' | '其他';
export type InfoSource = '本人' | '家长' | '其他';

export interface PatientInfo {
  name: string;
  gender: Gender;
  age: number;
  dob: string;
  date: string;
  id: string;
  clinician: string;
  source: InfoSource;
}

export interface CSSRSData {
  q1: boolean | null;
  q2: boolean | null;
  q3: boolean | null;
  q4: boolean | null;
  q5: boolean | null;
  q6: boolean | null;
  intensityScore: number;
  intensityDescription: string;
  frequency: string;
}

export interface TraumaHistory {
  none: boolean;
  naturalDisaster: boolean;
  accident: boolean;
  witnessViolence: boolean;
  physicalAbuse: boolean;
  sexualTrauma: boolean;
  loss: boolean;
  medicalTrauma: boolean;
}

export interface ChildAdventureData {
  mood: string;
  moodReason: string;
  bodyMarkers: { x: number; y: number; type: 'bandaid' | 'circle' }[];
  familyPositions: { id: string; x: number; y: number; scale: number; name: string }[];
  wishes: string[];
}

export interface UCLAPTSDData {
  history: TraumaHistory;
  scores: Record<string, number>;
  totalScore: number;
  adventure?: ChildAdventureData;
}

export interface PCL5Data {
  history: TraumaHistory;
  indexTrauma: string;
  indexTraumaDate: string;
  scores: Record<string, number>;
  totalScore: number;
}

export interface AssessmentState {
  patient: PatientInfo;
  cssrs: CSSRSData;
  ucla: UCLAPTSDData;
  pcl5: PCL5Data;
  resilience: {
    child: { scores: Record<string, number> };
    teen: { scores: Record<string, number> };
    adult: { cdrisc: Record<string, number>; mspss: Record<string, number> };
  };
  summary: {
    clinicalFormulation: string;
    needs: string;
    actionPlan: string;
  };
}
