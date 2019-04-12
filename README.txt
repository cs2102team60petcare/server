1.	You can download code60.zip and unzip it at a location of interest. 
2.	You can then call “npm install" to install all the packages and their dependencies. 
3.	You’ll have to have a postgres server running in the background with the name “cs2102_petcare_trial”.  
4.	Take the code in database/init_petcare.sql and run it on the database you created. 
	This has the Relational Schema, Triggers and dummy data. 
5.	You’ll need a .env file having the following lines of code. (please note that you may need to slightly change and/or give it the 	
	username and password as well) 
			DATABASE_URL=postgres://localhost:5432/cs2102_petcare_trial
			SESSION_SECRET=secret
You can now run the code with “npm start”

If at any stage you have problems running the code, please do not hesitate to send your queries to saifum@u.nus.edu or create an issue at https://github.com/cs2102team60petcare/server. We will get back to you as soon as possible. 
