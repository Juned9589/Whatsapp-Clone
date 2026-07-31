export interface Call {
  _id: string;

  caller: {
    _id: string;
    name: string;
    image: string;
  };

  receiver: {
    _id: string;
    name: string;
    image?: string;
  };

  type: "audio" | "video";

  status: "answered" | "missed" | "rejected";

  duration: number;

  createdAt: string;
}
