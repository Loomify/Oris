# Oris
*An open source research platform for researchers, by researchers*

Oris is a platform that aims to make research more accessible and collaborative without the headaches associated with traditional platforms. This current repository is the source code for the platform as the server, which you will need to initialize and setup if you would like to run your own Oris server. THe program is under the AGPLv3 license for anyone who is interested in using the code for their own purposes.

## Current features
- **Authentication**: Users can register and create an account to access the platform as a whole.
- More coming soon.

## Getting started

### Requirements
- Node.js
- PostgreSQL Server

### Steps
To get started, you will need to clone this repository and install all dependencies seen in the package.json file. After that, you will need to create a .env file in the root directory, with you being able to reference the .env.example file and input all the necessary connection strings and the JWT token.

You will then need to go to drizzle.config.json and enter the connection string for your PostgreSQL database, and then you will need to run the following commands:

```bash
npm drizzle-kit generate
npm drizzle-kit migrate
```

After that, you can run the following command to start the server:

```bash
npm run dev
```

And that's it! You now have your own Oris server running on your local machine. You can access it by going to localhost:3000 in your browser.