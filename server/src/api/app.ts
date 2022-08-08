import express from "express";
import handleError from "./middleware/error-handler.middleware";

// Routes
import mangaRoutes from "./routes/manga.routes";
import chapterRoutes from "./routes/chapter.routes";
import pageRoutes from "./routes/page.routes";

const app = express();

// Manga images
app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use('/manga', mangaRoutes);
app.use('/chapter', chapterRoutes);
app.use('/page', pageRoutes);

// Handle error middleware
app.use(handleError);

export default app;