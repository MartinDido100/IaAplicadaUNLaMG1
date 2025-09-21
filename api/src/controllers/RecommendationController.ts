import type { Request, Response } from "express";
import { Router } from "express";
import HttpStatus from "http-status";
import type { RecommendationPromptDto } from "../models/movieRecommendation.js";
import {
  GeminiRecommenderServiceImpl,
  MovieService,
} from "../services/index.js";
import type { MovieRecommendationService } from "../services/interfaces/index.js";

export const recommendationRouter: Router = Router();

const movieService: MovieService = new MovieService();
const movieRecommendationService: MovieRecommendationService =
  new GeminiRecommenderServiceImpl();

recommendationRouter.post(
  "/:userId/recommend",
  async (req: Request<any, any, RecommendationPromptDto>, res: Response) => {
    const payload: RecommendationPromptDto = req.body;

    const response = await movieRecommendationService.recommendMovies(payload);

    res.status(HttpStatus.OK).json(response);
  },
);

recommendationRouter.get(
  "/:userId/:movieId",
  async (req: Request, res: Response): Promise<void> => {
    const { userId, movieId } = req.params;
    const movieIdNumber: number = Number(movieId);

    try {
      console.log(`Getting movie ${movieIdNumber} for user ${userId}`);
      const movie = await movieService.getMovieById(movieIdNumber);

      res.status(200).json({
        success: true,
        userId,
        movieId: movieIdNumber,
        movie,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        success: false,
        userId,
        movieId: movieIdNumber,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

export class RecommendationController {
  movieService = new MovieService();
}
