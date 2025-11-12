import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FlashTalks API",
      version: "1.0.0",
      description:
        "FlashTalks Backend API — Micro-talk video sharing platform.\n\nThis API supports user authentication, video uploads, likes, saves, and more.",
    },
    servers: [
      {
        url:
          process.env.RENDER_EXTERNAL_URL ||
          "http://localhost:3000/api",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger docs live at /api-docs");
}
