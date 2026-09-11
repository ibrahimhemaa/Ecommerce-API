import app from "./app.js";
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Serve is running on local host ${PORT}`);
});
export default server ; 