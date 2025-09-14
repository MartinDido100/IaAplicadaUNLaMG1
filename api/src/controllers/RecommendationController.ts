import type { Request, Response } from 'express';
import { MovieService } from '../services/MovieService.js';
import { Router } from 'express'
 
export const recommendationRouter: Router = Router();

recommendationRouter.get('/:userId/:movieId', async (req: Request, res: Response): Promise<void> => {
  const { userId, movieId } = req.params;
  const movieIdNumber: number = Number(movieId);
  
  const movieService = new MovieService();
  
  try {
    console.log(`Getting movie ${movieIdNumber} for user ${userId}`);
    const movie = await movieService.getMovieById(movieIdNumber);
    
    res.status(200).json({
      success: true,
      userId,
      movieId: movieIdNumber,
      movie
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      userId,
      movieId: movieIdNumber,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export class RecommendationController {
  movieService = new MovieService()
}
