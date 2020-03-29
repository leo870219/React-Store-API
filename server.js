const path = require("path");
const fs = require("fs");
const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();
server.use(jsonServer.bodyParser);
server.use(middlewares);

const getUsersDb = () => {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, "users.json"), "UTF-8")
  );
};

const isAuthenticated = ({ email, password }) => {
  return (
    getUsersDb().users.findIndex(
      user => user.email === email && user.password === password
    ) !== -1
  );
};

const SECRET = "1232RWERFSFASD21321312";
const expiresIn = "1h";
const createToken = payload => {
  return jwt.sign(payload, SECRET, { expiresIn });
};

server.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (isAuthenticated({ email, password })) {
    const user = getUsersDb().users.find(
      u => u.email === email && u.password === password
    );
    const { nickname, type } = user;
    const jwToken = createToken({ nickname, type,email });
    return res.status(200).json(jwToken);
  } else {
    const status = 401;
    const message = "Incorrect email or password";
    return res.status(status).json({ status, message });
  }
  console.log("Login Success");
  return res.status(200).json("Login Success");
});

server.use(router);
server.listen(3003, () => {
  console.log("JSON Server is running");
});
