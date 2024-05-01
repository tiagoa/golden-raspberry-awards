const csvParser = require('csv-parser');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

let db;
module.exports = {
    start: (file, database) => {
        db = new sqlite3.Database(database);
        db.serialize(() => {
            db.run(`DROP TABLE IF EXISTS movies`);
            db.run(`CREATE TABLE IF NOT EXISTS movies (
                year INTEGER,
                title TEXT,
                studios TEXT,
                producers TEXT,
                winner INTEGER
            )`);
        
            const csvFilePath = file;
            const results = [];
        
            fs.createReadStream(csvFilePath)
                .pipe(csvParser({separator: ';'}))
                .on('data', (data) => {
                    results.push(data);
                })
                .on('end', () => {
                    const stmt = db.prepare('INSERT INTO movies (year, title, studios, producers, winner) VALUES (?, ?,?,?,?)');
                    results.forEach((row) => {
                        stmt.run(row['year'], row['title'], row['studios'], row['producers'], row['winner']);
                    });
                    stmt.finalize();
                });
        });
    },
    all: (query, params, callback) => {
        return db.all(query, params, callback)
    },
}