import { Link } from "./Link";
import { Table } from "./Table";
import moviesData from "../data/movies.json";
import itemsData from "../data/items.json";
import tweetsData from "../data/tweets.json";
import Star from "./assets/star.svg?react";
import { Route, Router } from "preact-iso";
import { Currency, Item } from "../types/types";
import { useCallback, useEffect, useRef } from "preact/hooks";

const formatDate = (date: Date) => {
  let month = "" + (date.getMonth() + 1);
  let day = "" + date.getDate();
  const year = date.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

const formatPrice = (price: Number, currency: Currency) => {
  const formattedPrice = price.toFixed(2);

  if (currency === "GBD") {
    return `£${formattedPrice}`;
  }

  return `$${formattedPrice}`;
};

interface MovieRatingProps {
  rating: number;
  size?: number;
}

function MovieRating({ rating, size = 12 }: MovieRatingProps) {
  const roundedRating = Math.floor(rating);
  const fill = roundedRating >= 5 ? "fill-yellow-500" : "fill-gray-400";
  const clipPath = "polygon(0 0, 50% 0, 50% 100%, 0 100%)";

  return (
    <div className="flex gap-1">
      {new Array(roundedRating).fill(roundedRating).map(() => (
        <Star className={fill} width={size} height={12} />
      ))}
      {rating % 1 > 0 && (
        <Star
          className={fill}
          width={size}
          height={12}
          style={{
            clipPath,
          }}
        />
      )}
    </div>
  );
}

const PAGES = [
  { title: "TWEETS", url: "/tweets", component: TweetsPage },
  { title: "CINEMA", url: "/cinema", component: MoviesPage },
  { title: "ITEMS", url: "/", component: ItemsPage },
];

export function Home() {
  return (
    <div className="bg-zinc-800 min-h-screen min-w-screen">
      <div className="p-20">
        <h1 className="text-7xl bg-theme text-zinc-800 w-fit">Bandar.</h1>
        <Router>
          {PAGES.map(({ url, component }) => (
            <Route component={component} path={`/home${url}`} />
          ))}
        </Router>
      </div>
      <footer className="border-t-1 border-zinc-700 mt-20 pb-20 pt-5 pb-8 flex gap-5 mx-15">
        <span className="text-xs text-zinc-600">
          Last Updated: {formatDate(new Date())}
        </span>
        <span className="ml-auto text-xs text-zinc-600">Yusof Bandar</span>
      </footer>
    </div>
  );
}

function ItemsPage() {
  const items = (itemsData.items as Item[])
    .sort(
      (aItem, bItem) =>
        new Date(bItem.buyDate).getTime() - new Date(aItem.buyDate).getTime(),
    )
    .map((item: Item) => ({
      strikeThrough: item.isBroken,
      rows: {
        title: !item.link
          ? item.title
          : {
              title: item.title,
              href: item.link,
              type: "link",
            },
        buyDate: formatDate(new Date(item.buyDate)),
        price: formatPrice(item.price, item.currency),
        pricePerDay: formatPrice(item.pricePerDay, item.currency),
      },
    }));

  return (
    <>
      <nav className="flex flex-col mt-10 gap-1">
        {PAGES.map(({ title, url }) => (
          <Link
            href={`/home${url}`}
            className="p-2"
            isActive={title === "ITEMS"}
          >
            {title}
          </Link>
        ))}
      </nav>
      <div className="mt-20">
        <Table
          columns={["Title", "Bought", "Price", "Price Per Day"]}
          rows={items}
        />
      </div>
    </>
  );
}

function MoviesPage() {
  const movies = moviesData.movies
    .sort(
      (aMovie, bMovie) =>
        new Date(bMovie["letterboxd:watchedDate"]).getTime() -
        new Date(aMovie["letterboxd:watchedDate"]).getTime(),
    )
    .map((movie) => ({
      title: {
        title: movie["letterboxd:filmTitle"],
        href: movie.link,
        type: "link",
      },
      rating: Number(movie["letterboxd:memberRating"]) ? (
        <MovieRating rating={Number(movie["letterboxd:memberRating"])} />
      ) : (
        ""
      ),
      watchedDate: movie["letterboxd:watchedDate"]
        ? formatDate(new Date(movie["letterboxd:watchedDate"]))
        : "",
    }));

  return (
    <>
      <nav className="flex flex-col mt-10 gap-1">
        {PAGES.map(({ title, url }) => (
          <Link
            href={`/home${url}`}
            className="p-2"
            isActive={title === "CINEMA"}
          >
            {title}
          </Link>
        ))}
      </nav>
      <div className="mt-20">
        <Table columns={["Title", "Rating", "Watched Date"]} rows={movies} />
      </div>
    </>
  );
}

function TweetsPage() {
  const containerRef = useRef(null);

  const tweetUrls = tweetsData.tweets.map(
    (tweet) => `https://twitter.com/username/status/${tweet.id}`,
  );

  const createWidgetScript = useCallback(() => {
    const script = document.createElement("script");
    script.id = "twitter-wjs";
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!document.getElementById("twitter-wjs")) {
      createWidgetScript();
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const placeholders = containerRef.current.querySelectorAll(
      ".twitter-tweet-placeholder",
    );

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const div = entry.target;
            const url = (div as any).dataset.url;

            // create blockquote
            const blockquote = document.createElement("blockquote");
            blockquote.className = "twitter-tweet";
            const a = document.createElement("a");
            a.href = url;
            blockquote.appendChild(a);

            div.appendChild(blockquote);

            obs.unobserve(div);
          }
        });

        // reload script to trigger loading of widgets
        const script = document.getElementById("twitter-wjs");
        script.remove();

        createWidgetScript();
      },
      { rootMargin: "200px" },
    );

    placeholders.forEach((p) => observer.observe(p));
  }, [tweetUrls]);

  return (
    <>
      <nav className="flex flex-col mt-10 gap-1">
        {PAGES.map(({ title, url }) => (
          <Link
            href={`/home${url}`}
            className="p-2"
            key={title}
            isActive={title === "TWEETS"}
          >
            {title}
          </Link>
        ))}
      </nav>
      <div className="mt-20 flex flex-col gap-5" ref={containerRef}>
        {tweetUrls.map((url) => (
          <div
            className="twitter-tweet-placeholder min-h-[100px]"
            key={url}
            data-url={url}
          />
        ))}
      </div>
    </>
  );
}
