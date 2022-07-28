const pageNotFound = (req, res) => res.status(404).send(`<h1>Page Not Found</h1> <br> <a href="/">Back</a>`);

module.exports = pageNotFound;