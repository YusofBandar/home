export interface Movie {
  title: string;
  link: string;
  "letterboxd:filmTitle": string;
  "letterboxd:watchedDate"?: string;
  pubDate?: string;
  "letterboxd:memberRating"?: string;
}

export interface TweetsResponse {
  data: Tweet[];
  meta?: {
    next_token?: string;
  };
}

export interface Tweet {
  id: string;
  author_id: string;
  text: string;
}

export type Currency = "GBD" | "USD";

export interface Item {
  title: string;
  link?: string;
  buyDate: string;
  price: number;
  currency: Currency;
  pricePerDay: number;
  isBroken?: boolean;
}
