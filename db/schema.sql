CREATE DATABASE IF NOT EXISTS flashcard_app
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE flashcard_app;

CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  username      VARCHAR(64)  UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS flashcards (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  owner_id   INT NOT NULL,
  deck       VARCHAR(100) NOT NULL DEFAULT 'General',
  front      TEXT NOT NULL,
  back       TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_deck (deck),
  FULLTEXT KEY ft_front_back (front, back)
);

CREATE TABLE IF NOT EXISTS view_history (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  flashcard_id INT NOT NULL,
  result       ENUM('correct', 'incorrect', 'skipped') NOT NULL DEFAULT 'skipped',
  studied_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)      REFERENCES users(id)      ON DELETE CASCADE,
  FOREIGN KEY (flashcard_id) REFERENCES flashcards(id) ON DELETE CASCADE,
  INDEX idx_user_time (user_id, studied_at)
);
