# Oris
*An open-source research platform for researchers, by researchers*

Oris is a platform that aims to make research more accessible and collaborative without the headaches associated with traditional platforms. This current repository is the source code for the platform as the server, which you will need to initialize and set up if you would like to run your own Oris server. The program is under the AGPLv3 license for anyone interested in using the code for their purposes.

## Current features
- **Authentication**: Users can register and create an account to access the platform as a whole.
- More coming soon.

## Running your own Oris

### Requirements
- Node.js
- PostgreSQL Server and server information, [documentation to setup and install](https://www.postgresql.org/docs/current/tutorial-install.html).
- File storage medium, such as local storage or Vercel Blob.

### Steps
To get started, you will need to clone this repository and install all dependencies seen in the package.json file, which you can do by running ``npm install``. After that, you will need to make a PostgreSQL server and a database and name it whatever you would like since Oris utilizes Postgres as the primary database and note all the connection information down. You will then need to utilize the connection information into the necessary variables by creating a .env file, with you needing to explicitly use the variable names from .env.example.

You will also have additional variables to consider for the file storage medium, such as local storage or Vercel Blob. You will need to set the environment variables for the medium appropriately depending on your medium so the adapter can work correctly.

The supported file storage mediums are:
- Local storage, denoted as ```
file_storage_method = "local"
file_storage_path = "STORAGE_PATH"
```
- Vercel Blob, denoted as ```
file_storage_method = "vercel"
BLOB_READ_WRITE_TOKEN="BLOB_READ_WRITE_TOKEN"
```

After populating the environment variables, you will need to run the following commands to be able to populate the database by utilizing the credentials that you have set in your environment variables:

```bash
npm drizzle-kit generate
npm drizzle-kit migrate
```


As for now, these are the only supported file storage mediums, but more will be added in the future or can be added by the community.

After that, you can run the following command to start the server:

```bash
npm run dev
```

And that's it! You now have your own Oris server running on your local machine. You can access it by going to localhost:3000 in your browser.
