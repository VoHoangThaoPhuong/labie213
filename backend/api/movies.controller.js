import MoviesDAO from '../dao/moviesDAO.js';

export default class MoviesController {
    static async apiGetMovies(req, res, next) {
        const moviesPerPage = req.query.moviesPerPage ? parseInt(req.query.moviesPerPage) : 20;
        const page = req.query.page ? parseInt(req.query.page) : 0;

        let filters = {};

        if (req.query.rated) {
            filters.rated = req.query.rated;
        } else if (req.query.title) {
            filters.title = req.query.title;
        }

        const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({
            filters,
            page,
            moviesPerPage
        });

        let response = {
            movies: moviesList,
            page: page,
            filters: filters,
            entries_per_page: moviesPerPage,
            total_results: totalNumMovies
        };

        res.json(response);
    }
    static async apiGetMovieById(req, res, next) {
        try {
            let id = req.params.id || {};
            let movie = await MoviesDAO.getMovieById(id);

            if (!movie) {
                res.status(404).json({
                    success: false,
                    message: 'Movie not found'
                });
                return;
            }

            res.json({
                success: true,
                message: 'Get movie by id successfully',
                movie: movie
            });
        } catch (error) {
            console.log(`api, ${error}`);
            res.status(500).json({
                success: false,
                message: 'Unable to get movie by id',
                error: error
            });
        }
    }

    static async apiGetRatings(req, res, next) {
        try {
            let propertyTypes = await MoviesDAO.getRatings();
            res.json({
                success: true,
                message: 'Get ratings successfully',
                rating: propertyTypes
            });
        } catch (error) {
            console.log(`api, ${error}`);
            res.status(500).json({
                success: false,
                message: 'Unable to get ratings',
                error: error
            });
        }
    }
}