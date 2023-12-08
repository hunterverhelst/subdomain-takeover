import express from "express"
import bcrypt from "bcrypt"
import cors from "cors"
import jwt from "jsonwebtoken"
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import lodash from 'lodash'
import { updateDNS } from './docker.js'

type User = {
  email: string
  password: string
  prefix: string
}

type Data = {
  users: User[]
}

// Extend Low class with a new `chain` field
class LowWithLodash<T> extends Low<T> {
  chain: lodash.ExpChain<this['data']> = lodash.chain(this).get('data')
}

const defaultData: Data = {
  users: [],
}
const adapter = new JSONFile<Data>('db.json')

const db = new LowWithLodash(adapter, defaultData)
await db.read()

// Initialize Express app
const app = express()

// Define a JWT secret key. This should be isolated by using env variables for security
// Since this is designed to be run locally it doesn't matter too much in this context
const jwtSecretKey = "opikajfjawefolhjad"

// Set up CORS and JSON middlewares
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic home route for the API
app.get("/api", (_req, res) => {
  res.send("Auth API.\nPlease use POST /auth & POST /verify for authentication")
})

// The auth endpoint that creates a new user record or logs a user based on an existing record
app.post("/api/auth", (req, res) => {

  const { email, password } = req.body;

  // Look up the user entry in the database
  const user = db.chain.get("users").value().filter(user => email === user.email)

  // If found, compare the hashed passwords and generate the JWT token for the user
  if (user.length === 1) {
    bcrypt.compare(password, user[0].password, function (_err, result) {
      if (!result) {
        return res.status(401).json({ message: "Username or password is incorrect" });
      } else {
        let loginData = {
          email,
          signInTime: Date.now(),
        };

        const token = jwt.sign(loginData, jwtSecretKey);
        res.status(200).json({ message: "success", token });
      }
    });
    // If no user is found, send 401
  } else if (user.length === 0) {
    res.status(401).json({ message: "Username or password is incorrect" })
  }


})

const checkToken = (req: any) => {
  const tokenHeaderKey = "jwt-token";
  const authToken = req.headers[tokenHeaderKey];
  try {
    const verified = jwt.verify(authToken, jwtSecretKey);
    if (verified) {
      return verified;
    } else {
      // Access Denied
      return null;
    }
  } catch (error) {
    // Access Denied
    return null;
  }

}
// The verify endpoint that checks if a given JWT token is valid
app.post('/api/verify', (req, res) => {
  try {
    const verified = checkToken(req)
    if (verified !== null) {
      return res
        .status(200)
        .json({ status: "logged in", message: "success" });
    } else {
      // Access Denied
      return res.status(401).json({ status: "invalid auth", message: "error" });
    }
  } catch (error) {
    // Access Denied
    return res.status(401).json({ status: "invalid auth", message: "error" });
  }

})

// An endpoint to see if there's an existing account for a given email address
app.post('/api/check-account', (req, res) => {
  const { email } = req.body

  const user = db.chain.get("users").value().filter(user => email === user.email)

  res.status(200).json({
    status: user.length === 1 ? "User exists" : "User does not exist", userExists: user.length === 1
  })
})
app.get('/api/domainprefix', (req, res) => {
  const userData = checkToken(req);
  if (userData === null) {
    res.sendStatus(401);
    return
  }

  const user = db.chain.get("users").value().filter(user => userData.email === user.email)[0]
  res.status(200).json({ prefix: user.prefix })
})
app.post('/api/domainprefix', (req, res) => {
  const userData = checkToken(req);
  if (userData === null) {
    res.sendStatus(401);
    return
  }
  if (req.body.prefix in ["dns", "www", "irc"]) {
    res.status(401).json({ message: "subdomain is either reserved or taken" })
  }
  const user = db.chain.get("users").value().filter(user => userData.email === user.email)[0]
  let oldPrefix = user.prefix
  user.prefix = req.body.prefix
  db.write()
  updateDNS(oldPrefix, req.body.prefix)
  res.sendStatus(201)
})

console.log("Listening on port 3080")
app.listen(3080)