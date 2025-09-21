import axios from "axios";
import { Constants } from "./constants.js";

export const tmdbClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 8000,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${Constants.TMDB_TOKEN!}`,
  },
});
