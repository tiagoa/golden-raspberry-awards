const express = require('express');

const app = express();
const db = require('./db');

const calculateProducerIntervals = (movies) => {
    const intervals = [];

    for (let i = 0; i < movies.length - 1; i++) {
        const currentMovie = movies[i];
        const nextMovie = movies[i + 1];

        const interval = nextMovie.year - currentMovie.year;
        const producerInterval = {
            producer: currentMovie.producer,
            interval: interval,
            previousWin: currentMovie.year,
            followingWin: nextMovie.year
        };
        intervals.push(producerInterval);
    }

    return intervals;
}
app.get('/prize-range', (req, res) => {
    const query = 'select * from movies where winner = "yes" order by year'
    db.all(query, [], (err, movies) => {
        if (err) {
          console.error('Error executing query:', err.message);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        const moviesByProducer = movies.reduce((acc, movie) => {
            const producers = movie.producers.split(/,|\sand\s/);
            for (let i = 0; i < producers.length; i++) {
                let producerName = producers[i].trim();
                acc[producerName] = acc[producerName] || [];
                movie.producer = producerName
                acc[producerName].push({...movie});
            }
            return acc;
        }, {});

        let intervals = []
        for (const producerMovies of Object.values(moviesByProducer)) {
            const prodIntervals = calculateProducerIntervals(producerMovies);
            if (prodIntervals.length > 0) {
                intervals = [...intervals, ...prodIntervals];
            }
        }
        let min = [...intervals].sort((a, b) => a.interval > b.interval ? 1 : -1)
            .slice(0, 1);
        let max = [...intervals].sort((a, b) => a.interval > b.interval ? -1 : 1)
            .slice(0, 1);

        res.json({
            min: Object.values(min).flat(),
            max: Object.values(max).flat()
        });
    });
});

module.exports = app