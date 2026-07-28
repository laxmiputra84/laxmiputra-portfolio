-- DDL Script to create all Database Tables for Laxmiputra Full Stack Portfolio
-- Database: portfolio_db

CREATE DATABASE IF NOT EXISTS `portfolio_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `portfolio_db`;

-- 1. Table: users
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `hashed_password` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `is_admin` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `ix_users_username` (`username`),
  INDEX `ix_users_email` (`email`)
) ENGINE=InnoDB;

-- 2. Table: settings
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `site_name` VARCHAR(100) DEFAULT 'Laxmiputra Portfolio',
  `hero_title` VARCHAR(200) NULL,
  `hero_subtitle` VARCHAR(300) NULL,
  `contact_email` VARCHAR(100) NULL,
  `contact_phone` VARCHAR(50) NULL,
  `about_text` TEXT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Table: projects
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `image_url` VARCHAR(255) NULL,
  `github_url` VARCHAR(255) NULL,
  `live_url` VARCHAR(255) NULL,
  `technologies` VARCHAR(255) NOT NULL,
  `featured` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Table: skills
CREATE TABLE IF NOT EXISTS `skills` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `category` VARCHAR(50) NOT NULL,
  `level` INT NOT NULL,
  `icon_name` VARCHAR(50) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. Table: experiences
CREATE TABLE IF NOT EXISTS `experiences` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company` VARCHAR(100) NOT NULL,
  `role` VARCHAR(100) NOT NULL,
  `location` VARCHAR(100) NULL,
  `start_date` VARCHAR(50) NOT NULL,
  `end_date` VARCHAR(50) NULL,
  `description` TEXT NOT NULL,
  `current` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 6. Table: education
CREATE TABLE IF NOT EXISTS `education` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `institution` VARCHAR(100) NOT NULL,
  `degree` VARCHAR(100) NOT NULL,
  `field_of_study` VARCHAR(100) NULL,
  `start_date` VARCHAR(50) NOT NULL,
  `end_date` VARCHAR(50) NULL,
  `description` TEXT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 7. Table: certificates
CREATE TABLE IF NOT EXISTS `certificates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `issuing_organization` VARCHAR(100) NOT NULL,
  `issue_date` VARCHAR(50) NOT NULL,
  `expiration_date` VARCHAR(50) NULL,
  `credential_id` VARCHAR(100) NULL,
  `credential_url` VARCHAR(255) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 8. Table: contact_messages
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `subject` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 9. Table: social_links
CREATE TABLE IF NOT EXISTS `social_links` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `platform` VARCHAR(50) NOT NULL UNIQUE,
  `url` VARCHAR(255) NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 10. Table: resumes
CREATE TABLE IF NOT EXISTS `resumes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(100) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `is_active` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 11. Table: services
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `icon_name` VARCHAR(50) NULL,
  `price` VARCHAR(50) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Seed default user (Admin)
-- Default Password is: Admin@Portfolio2024 (hashed using bcrypt)
INSERT INTO `users` (`username`, `email`, `hashed_password`, `full_name`, `is_active`, `is_admin`) 
VALUES ('admin', 'laxmiputrahipparagi3@gmail.com', '$2b$12$k21f1T7H7F6hD3o8QxYFiey1wG4X1iK9xL2hX9k9o6c7r8n2v3y4e', 'Laxmiputra Hipparagi', 1, 1)
ON DUPLICATE KEY UPDATE `username`=`username`;
