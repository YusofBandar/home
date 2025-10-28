import { Link } from "./Link";
import { Table } from "./Table";
import moviesData from "../data/movies.json";
import Star from "./assets/star.svg?react";

const formatDate = (date: Date) => {
  let month = "" + (date.getMonth() + 1);
  let day = "" + date.getDate();
  const year = date.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
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

const PAGES = ["CINEMA"];

export function Home() {
  const movies = moviesData.movies
    .sort(
      (aMovie, bMovie) =>
        new Date(bMovie["letterboxd:watchedDate"]).getTime() -
        new Date(aMovie["letterboxd:watchedDate"]).getTime()
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
    <div className="bg-zinc-800 min-h-screen min-w-screen">
      <div className="p-20">
        <h1 className="text-7xl bg-theme text-zinc-800 w-fit">Bandar.</h1>
        <nav className="flex flex-col  mt-10">
          {PAGES.map((l) => (
            <Link href="http://example.com" className="p-2">
              {l}
            </Link>
          ))}
        </nav>
        <div className="mt-20">
          <Table columns={["Title", "Rating", "Watched Date"]} rows={movies} />
        </div>
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
