const allowedOrigins = [
  "https://scanmangaverse.netlify.app",
  "http://localhost:5173"
];

const corsOptionsDelegate = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Non autorisé par CORS"));
    }
  },
  credentials: true
};

export { corsOptionsDelegate };
