export const globalError = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") DevError(err, res);
  else productionError(err, res);
};

const DevError = (err, res) => {
  res
    .status(err.statuscode || 500)
    .json({ err, stack: err.stack, message: err.message });
};

const productionError = (err, res) => {
  res.status(err.statuscode || 500).json({ message: err.message });
};
