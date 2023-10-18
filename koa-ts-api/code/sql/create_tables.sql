-- Creation of user table
CREATE TABLE IF NOT EXISTS "user" (
  id INT NOT NULL,
  email VARCHAR(250) NOT NULL,
  username VARCHAR(250) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  PRIMARY KEY (id)
);

-- Creation of project table
CREATE TABLE IF NOT EXISTS "project" (
  id INT NOT NULL,
  name varchar(250) NOT NULL,
  app_secret varchar(32) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  url varchar(250),
  PRIMARY KEY (id),
  user_id INT REFERENCES "user"(id) NOT NULL
);

CREATE TYPE deploymentStatus AS ENUM ('pending', 'building', 'deploying', 'failed', 'cancelled', 'done');

-- Creation of deployment table
CREATE TABLE IF NOT EXISTS "deployment" (
  id SERIAL NOT NULL,
  deployed_in INT,
  status deploymentStatus NOT NULL,
  created_at TIMESTAMP NOT NULL,
  PRIMARY KEY (id),
  project_id INT REFERENCES project(id)
);