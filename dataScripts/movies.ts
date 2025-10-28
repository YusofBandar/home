import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";
import { every } from "lodash-es";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { Movie } from "../types/types";

const DIR_NAME = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(DIR_NAME, "../data/movies.json");

interface MovieXML {
  title: string[];
  link: string[];
  "letterboxd:filmTitle": string[];
  "letterboxd:watchedData"?: string[];
  pubDate: string[];
  "letterboxd:memberRating"?: string[];
}

const isAMovieXML = (item: object): item is MovieXML => {
  const requiredKeys = [
    "title",
    "link",
    "letterboxd:filmTitle",
    "letterboxd:watchedDate",
  ];

  const isMovie = every(requiredKeys.map((key) => key in item));
  if (!isMovie) {
    console.log(`skipping item TITLE=${"title" in item ? item.title : ""}`);
  }

  return isMovie;
};

const extractMovieDatails = (movieXML: MovieXML): Movie => {
  const movie: Movie = {
    title: movieXML.title[0],
    link: movieXML.link[0],
    "letterboxd:filmTitle": movieXML["letterboxd:filmTitle"][0],
    "letterboxd:watchedDate": movieXML["letterboxd:watchedDate"][0],
    pubDate: movieXML["pubDate"][0],
    "letterboxd:memberRating": movieXML["letterboxd:memberRating"]?.[0],
  };

  return movie;
};

const getWatchedMovies = async () => {
  let watchedMovies: { [id: string]: Movie } = {};
  for (const movie of readMovieDataFile()) {
    watchedMovies[movie["letterboxd:filmTitle"]] = movie;
  }

  const username = "bandary";

  const res = await fetch(`https://letterboxd.com/${username}/rss/`);
  const xml = await res.text();
  const data = await parseStringPromise(xml);

  const movies = data.rss.channel[0].item.filter(isAMovieXML) as MovieXML[];

  for (const movieXML of movies) {
    const movie = extractMovieDatails(movieXML);
    watchedMovies[movie["letterboxd:filmTitle"]] = movie;
  }

  writeToMovieDataFile(watchedMovies);
  console.log(`WRITTEN ${Object.keys(watchedMovies).length} MOVIES`);
};

const readMovieDataFile = (): Movie[] => {
  const dataFileExists = fs.existsSync(DATA_PATH);
  if (!dataFileExists) {
    return [];
  }

  try {
    const moviesJson = fs.readFileSync(DATA_PATH).toString();
    const movies = JSON.parse(moviesJson).movies as Movie[];
    return movies;
  } catch {
    return [];
  }
};

const writeToMovieDataFile = (movies: { [id: string]: Movie }) => {
  const list = Object.values(movies);
  const currentDate = new Date().toUTCString();
  const jsonList = JSON.stringify(
    { lastRan: currentDate, movies: list },
    undefined,
    4,
  );

  fs.writeFileSync(DATA_PATH, jsonList);
};

getWatchedMovies();
