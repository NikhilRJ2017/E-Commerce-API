require("dotenv").config();
require("express-async-errors");
const connectDB = require("./config/db/connect");
const express = require("express");
const app = express();

//************* other packages **************/
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const pageNotFound = require("./config/middlewares/page_not_found");
const errorHandler = require("./config/middlewares/error_handler");

//************** importing all routes ************/
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const orderRoutes = require("./routes/orderRoutes");

//************** logger middleware ***************/
app.use(morgan("tiny"));

//************** body parsing middleware ***************/
app.use(express.json());

//************** cookie pasring middleware, using signed cookies ***************/
app.use(cookieParser(process.env.JWT_SECRET_KEY));

//************** static assets ***************/
app.use(express.static("./public"));

//************** express file upload middleware ****************/
app.use(
    fileUpload({
        useTempFiles: true,
        safeFileNames: true,
        preserveExtension: true,
    })
);

//************** configuring cloudinary ****************/
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//************** routes middlewares ***************/
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/orders", orderRoutes);

app.get("/api/v1", (req, res) => {
    res.send("E-Commerce API");
});

//************** error handler and page not found *************/
app.use(pageNotFound);
app.use(errorHandler);

//*************** spin up the server ***************/
const PORT = process.env.PORT || 5000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_DB_URI);
        app.listen(PORT, () => {
            console.log(`Server is listeneing on port ${PORT}...`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
