const express = require('express');
const csvParser = require('csv-parser');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const app = express();
let db;
app.start = (file, database) => {
    db = new sqlite3.Database(database);
    db.serialize(() => {
        db.run(`DROP TABLE IF EXISTS movies`);
        db.run(`CREATE TABLE IF NOT EXISTS movies (
            year INTEGER,
            producer TEXT
        )`);

        const csvFilePath = file;
        const results = [];

        fs.createReadStream(csvFilePath)
            .pipe(csvParser())
            .on('data', (data) => {
                results.push(data);
            })
            .on('end', () => {
                const stmt = db.prepare('INSERT INTO movies (year, producer) VALUES (?, ?)');
                results.forEach((row) => {
                    stmt.run(row['Year'], row['Producer']);
                });
                stmt.finalize();
            });
    });
}

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
    const query = 'select * from movies order by year'

    db.all(query, [], (err, movies) => {
        if (err) {
          console.error('Error executing query:', err.message);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        const moviesByProducer = movies.reduce((acc, movie) => {
            acc[movie.producer] = acc[movie.producer] || [];
            acc[movie.producer].push(movie);
            return acc;
        }, {});

        const min = {}
        const max = {}
        for (const [producer, producerMovies] of Object.entries(moviesByProducer)) {
            const intervals = calculateProducerIntervals(producerMovies);            
            min[producer] = intervals.sort((a, b) => a.interval - b.interval)
                .slice(0, 1);
            max[producer] = intervals.sort((a, b) => b.interval - a.interval)
                .slice(0, 1);
        }
        res.json({
            min: Object.values(min).flat(),
            max: Object.values(max).flat()
        });
    });
});

module.exports = app