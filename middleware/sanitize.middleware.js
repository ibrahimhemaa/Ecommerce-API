export const sanitizeEmptyArrayItems = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    for (const key of Object.keys(req.body)) {
      if (Array.isArray(req.body[key])) {
        req.body[key] = req.body[key].filter((v) => v !== "" && v != null);
      }
    }
  }
  next();
};