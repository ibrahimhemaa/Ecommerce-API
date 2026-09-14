import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ecommerce System API",
      version: "1.0.0",
      description:
        "RESTful E-commerce API built with Express, MongoDB, JWT auth, Stripe payments, cart, orders, wishlist and more.",
    },
    servers: [
      {
    url: process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`,
    description: "API Server",
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
    tags: [
      { name: "Auth", description: "Authentication and password reset" },
      { name: "Categories", description: "Category operations" },
      { name: "SubCategories", description: "Sub-category operations" },
      { name: "Brands", description: "Brand operations" },
      { name: "Products", description: "Product operations" },
      { name: "Reviews", description: "Product reviews" },
      { name: "Users", description: "User management" },
      { name: "Cart", description: "Shopping cart operations" },
      { name: "Coupons", description: "Discount coupons" },
      { name: "Orders", description: "Order management" },
      { name: "Wishlist", description: "User wishlist" },
      { name: "Payments", description: "Stripe payment integration" },
    ],
  },
  apis: ["./Routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = swaggerUi.serve;
export const swaggerSetup = swaggerUi.setup(swaggerSpec);
