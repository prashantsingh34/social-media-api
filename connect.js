import dotenv from "dotenv";
import mysql from "mysql2";
dotenv.config();

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});


db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");

  const createTables = [
    {
      name: 'users',
      query: `
        CREATE TABLE IF NOT EXISTS social.users (
          id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(45) NOT NULL,
          username VARCHAR(45) NOT NULL,
          email VARCHAR(45) NOT NULL,
          coverPic VARCHAR(300) NULL,
          profilePic VARCHAR(300) NULL,
          city VARCHAR(45) NULL,
          website VARCHAR(45) NULL,
          password VARCHAR(200) NOT NULL,
          PRIMARY KEY (id)
        )`
    },
    {
      name: 'posts',
      query: `
        CREATE TABLE IF NOT EXISTS social.posts (
          id INT NOT NULL AUTO_INCREMENT,
          img VARCHAR(200),
          userId INT NOT NULL,
          descr VARCHAR(200),
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          INDEX (userId),
          FOREIGN KEY (userId) REFERENCES social.users(id) ON DELETE CASCADE ON UPDATE CASCADE
        )`
    },
    {
      name: 'comments',
      query: `
        CREATE TABLE IF NOT EXISTS social.comments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          descr VARCHAR(200) NOT NULL,
          createdAt DATETIME,
          userId INT NOT NULL,
          postId INT NOT NULL,
          INDEX (postId),
          INDEX (userId),
          FOREIGN KEY (userId) REFERENCES social.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
          FOREIGN KEY (postId) REFERENCES social.posts(id) ON DELETE CASCADE ON UPDATE CASCADE
        )`
    },
    {
      name: 'stories',
      query: `
        CREATE TABLE IF NOT EXISTS social.stories (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          img VARCHAR(200) NOT NULL,
          userId INT NOT NULL,
          INDEX (userId),
          FOREIGN KEY (userId) REFERENCES social.users(id) ON DELETE CASCADE ON UPDATE CASCADE
        )`
    },
    {
      name: 'relationships',
      query: `
        CREATE TABLE IF NOT EXISTS social.relationships (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          followerUserId INT NOT NULL,
          followedUserId INT NOT NULL,
          INDEX (followerUserId),
          INDEX (followedUserId),
          FOREIGN KEY (followerUserId) REFERENCES social.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
          FOREIGN KEY (followedUserId) REFERENCES social.users(id) ON DELETE CASCADE ON UPDATE CASCADE
        )`
    },
    {
      name: 'likes',
      query: `
        CREATE TABLE IF NOT EXISTS social.likes (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          userId INT NOT NULL,
          postId INT NOT NULL,
          INDEX (userId),
          INDEX (postId),
          FOREIGN KEY (userId) REFERENCES social.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
          FOREIGN KEY (postId) REFERENCES social.posts(id) ON DELETE CASCADE ON UPDATE CASCADE
        )`
    }
  ];
  
  const executeQueries = (db, queries) => {
    queries.forEach(({ name, query }) => {
      db.query(query, (err, result) => {
        if (err) {
          console.error(`Error creating table '${name}':`, err);
          return;
        }
        console.log(`Table '${name}' created or already exists`);
      });
    });
  };
  executeQueries(db, createTables);
  
});

