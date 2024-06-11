1. Make sure you have PostgreSQL installed on your device.
2. Create a new PostgreSQL database and user. Name your database 'rustikanarock'
3. I have provided a rustikanarock.backup file with all the content of the database inside that can be cloned on your device by running the following line on the terminal

## pg_restore -U your_username -d rustikanarock -v /path/to/rustikanarock.backup

Make sure you modify the line with your username and the actual path to the database dump.


2. RUN 'npm install' on the terminal before starting the server.

3. Modify the .env file in this folder with your PostgreSQL credentials, the structure is like this:

PORT=3000
SECRET_KEY=your_secret_key
DB_USER=your_db_user
DB_HOST = localhost
DB_DATABASE= rustikanarock
DB_PASSWORD=your_db_password
DB_PORT=5432

4. If the passwords in the database are not already hashed (check first), open the VS terminal and RUN 'node hashPasswords.js' to hash the passwords used for login in the database.

5. RUN 'node server.js' and navigate to localhost:3000

6. localhost:3000/dashboard.html is the endpoint for staff that you can access upon successful login on  localhost:3000/login.html 

7. Credentials for logging in are:

username: admin
password: rusti1234









