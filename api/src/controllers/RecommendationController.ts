import debug from "debug";
import type { Request, Response } from "express";
import { Router } from "express";
import HttpStatus from "http-status";
import type { PreferenceDto, RecommendationPromptDto } from "../models/index.js";
import type { MovieRecommendationService } from "../services/index.js";
import { EngineManagerImpl, MovieRecommendationServiceImpl, TmdbService } from "../services/index.js";
import { FirebaseUserRepositoryImpl } from "../repositories/index.js";

export const recommendationRouter: Router = Router();

const tmdbService = new TmdbService();
const engineManager = new EngineManagerImpl();
const userRepository = new FirebaseUserRepositoryImpl();
const movieRecommendationService: MovieRecommendationService = new MovieRecommendationServiceImpl(tmdbService, engineManager, userRepository);
const log = debug("app:recommendationController");

recommendationRouter.post("/", async (req: Request<any, any, RecommendationPromptDto>, res: Response) => {
  const payload: RecommendationPromptDto = req.body;
  const { email } = res.locals.context;

  log("Request received for movie recommendation");

  const response = await movieRecommendationService.recommendMovies(email, payload);

  res.status(HttpStatus.OK).json(response);
});

recommendationRouter.put("/preferences", async (req: Request<any, any, PreferenceDto>, res: Response) => {
  const payload: PreferenceDto = req.body;
  const { email } = res.locals.context;

  await movieRecommendationService.saveUserPreference(email, payload);
  res.status(HttpStatus.OK).json({ message: "Preferencias guardadas correctamente" });
});

recommendationRouter.get("/preferences", async (req: Request, res: Response) => {
  const { email } = res.locals.context;

  const preferences = await movieRecommendationService.getUserPreferences(email);
  res.status(HttpStatus.OK).json(preferences);
});

/**
 * @swagger
 * /api/recommendations:
 *   post:
 *     summary: Recommend movies for a user
 *     security:
 *       - bearerAuth: []
 *     description: This endpoint recommends movies based on the provided payload.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecommendationPromptDto'
 *     responses:
 *       200:
 *         description: A list of recommended movies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecommendationResponse'
 *             example:
 *               movies:
 *                 - adult: false
 *                   backdrop_path: "/2u7zbn8EudG6kLlBzUYqP8RyFU4.jpg"
 *                   belongs_to_collection: null
 *                   budget: 0
 *                   genres: [28, 12, 14]
 *                   homepage: ""
 *                   id: 122
 *                   imdb_id: ""
 *                   origin_country: []
 *                   original_language: "en"
 *                   original_title: "The Lord of the Rings: The Return of the King"
 *                   overview: "As armies mass for a final battle that will decide the fate of the world--and powerful, ancient forces of Light and Dark compete to determine the outcome--one member of the Fellowship of the Ring is revealed as the noble heir to the throne of the Kings of Men. Yet, the sole hope for triumph over evil lies with a brave hobbit, Frodo, who, accompanied by his loyal friend Sam and the hideous, wretched Gollum, ventures deep into the very dark heart of Mordor on his seemingly impossible quest to destroy the Ring of Power.​"
 *                   popularity: 22.591
 *                   poster_path: "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg"
 *                   production_companies: []
 *                   production_countries: []
 *                   release_date: "2003-12-17"
 *                   revenue: 0
 *                   runtime: 0
 *                   spoken_languages: []
 *                   status: ""
 *                   tagline: ""
 *                   title: "The Lord of the Rings: The Return of the King"
 *                   video: false
 *                   vote_average: 8.489
 *                   vote_count: 25454
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 * 
 * /api/recommendations/preferences:
 *   put:
 *     summary: Save user movie preference
 *     security:
 *       - bearerAuth: []
 *     description: Saves a movie that the user liked to their preference history.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PreferenceDto'
 *     responses:
 *       200:
 *         description: Preference saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Preferencias guardadas correctamente"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Error al guardar las preferencias"
 *   get:
 *     summary: Get user movie preferences
 *     security:
 *       - bearerAuth: []
 *     description: Retrieves the history of movies that the user has liked.
 *     responses:
 *       200:
 *         description: User preferences retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PreferencesHistoryDto'
 *             example:
 *               - preferences:
 *                   - email: "user@example.com"
 *                     tmdbId: "122"
 *                     name: "The Lord of the Rings: The Return of the King"
 *                     date: "2025-10-25T10:30:00.000Z"
 *                   - email: "user@example.com"
 *                     tmdbId: "238"
 *                     name: "The Godfather"
 *                     date: "2025-10-24T15:20:00.000Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Error al obtener las preferencias"
 * 
 * components:
 *   schemas:
 *     RecommendationPromptDto:
 *       type: object
 *       properties:
 *         textPrompt:
 *           type: string
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *         moods:
 *           type: array
 *           items:
 *             type: string
 *         audiences:
 *           type: array
 *           items:
 *             type: string
 *         durations:
 *           type: array
 *           items:
 *             type: string
 *       example:
 *         textPrompt: "Quiero ver una película emocionante y épica"
 *         genres: ["acción", "aventura"]
 *         moods: ["EMOCIONADO", "EPIC"]
 *         audiences: ["ADULTS", "TEENS"]
 *         durations: ["LONG", "MEDIUM"]
 *     RecommendationResponse:
 *       type: object
 *       properties:
 *         movies:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Movie'
 *     Movie:
 *       type: object
 *       properties:
 *         adult:
 *           type: boolean
 *         backdrop_path:
 *           type: string
 *         belongs_to_collection:
 *           type: object
 *           nullable: true
 *         budget:
 *           type: number
 *         genres:
 *           type: array
 *           items:
 *             type: number
 *           description: Array of genre IDs from TMDb
 *         homepage:
 *           type: string
 *         id:
 *           type: number
 *         imdb_id:
 *           type: string
 *         origin_country:
 *           type: array
 *           items:
 *             type: string
 *         original_language:
 *           type: string
 *         original_title:
 *           type: string
 *         overview:
 *           type: string
 *         popularity:
 *           type: number
 *         poster_path:
 *           type: string
 *         production_companies:
 *           type: array
 *           items:
 *             type: object
 *         production_countries:
 *           type: array
 *           items:
 *             type: object
 *         release_date:
 *           type: string
 *           format: date
 *         revenue:
 *           type: number
 *         runtime:
 *           type: number
 *         spoken_languages:
 *           type: array
 *           items:
 *             type: object
 *         status:
 *           type: string
 *         tagline:
 *           type: string
 *         title:
 *           type: string
 *         video:
 *           type: boolean
 *         vote_average:
 *           type: number
 *         vote_count:
 *           type: number
 *     PreferenceDto:
 *       type: object
 *       required:
 *         - tmdbId
 *         - name
 *       properties:
 *         tmdbId:
 *           type: string
 *           description: The TMDb ID of the movie
 *         name:
 *           type: string
 *           description: The name of the movie
 *       example:
 *         tmdbId: "122"
 *         name: "The Lord of the Rings: The Return of the King"
 *     UserPreferenceDto:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: User's email
 *         tmdbId:
 *           type: string
 *           description: The TMDb ID of the movie
 *         name:
 *           type: string
 *           description: The name of the movie
 *         date:
 *           type: string
 *           format: date-time
 *           description: When the preference was saved
 *       example:
 *         email: "user@example.com"
 *         tmdbId: "122"
 *         name: "The Lord of the Rings: The Return of the King"
 *         date: "2025-10-25T10:30:00.000Z"
 *     PreferencesHistoryDto:
 *       type: object
 *       properties:
 *         preferences:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserPreferenceDto'
 *       example:
 *         preferences:
 *           - email: "user@example.com"
 *             tmdbId: "122"
 *             name: "The Lord of the Rings: The Return of the King"
 *             date: "2025-10-25T10:30:00.000Z"
 */
