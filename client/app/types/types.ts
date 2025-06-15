export type Screen = {
  id: string;
  name: string;
  screenType: string;
};

export type Theatre = {
  id: string;
  name: string;
  city: string;
  state: string;
};

export type Review = {
  screenId: number;
  screenName: string;
  screenType: string;
  notes: string;
  liked: string;
  seatRow: string;
  seatNum: number;
  timestamp: string;
};
