# Welcome to E-Commerce-API!

Link to api documentation: https://e-commerce-apis-18.herokuapp.com/


# Method to install locally

Before installing npm modules and run the project, create '.env' file to the project with following entries: 

	-MONGO_DB_URI="add value"
	-JWT_SECRET_KEY= "add value"
	-JWT_ALGO="add value"
	-JWT_LIFETIME="add value"
	-CLOUDINARY_NAME="add value"
	-CLOUDINARY_API_KEY="add value"
	-CLOUDINARY_API_SECRET="add value"
	-PORT="add value" (optional, default is 5000)


Now, add following commands to the project:
>npm install
>npm install nodemon -D
>npm start

App runs on the port 5000 or else provide port value in .env file
