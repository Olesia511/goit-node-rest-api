const mongoose = require("mongoose");
const request = require("supertest");
require("dotenv").config();

const app = require("../app");

const { User } = require("../models/Users");

const { TEST_DB_HOST, PORT = 3000 } = process.env;

// ===== register test  ====

describe("test /api/users/register", () => {
  let server = null;

  beforeAll(async () => {
    await mongoose.connect(TEST_DB_HOST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("test register user with correct data", async () => {
    const registerUserData = {
      email: "test555@gmail.com",
      password: "test123",
    };
    const {
      statusCode,
      body: { user },
    } = await request(app).post("/api/users/register").send(registerUserData);

    expect(statusCode).toBe(201);
    expect(user.email).toBe(registerUserData.email);

    const newUser = await User.findOne({ email: registerUserData.email });
    expect(newUser.email).toBe(registerUserData.email);
  });
});

// ===== login test  ====

describe("test /api/users/login", () => {
  let server = null;

  beforeAll(async () => {
    await mongoose.connect(TEST_DB_HOST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("test login user with correct data", async () => {
    const loginUserData = {
      email: "test555@gmail.com",
      password: "test123",
    };

    const response = await request(app)
      .post("/api/users/login")
      .send(loginUserData);

    expect(response.statusCode).toBe(200);

    const { token, user } = response.body;

    expect(token).toBeDefined();
    expect(token).not.toBe("");

    expect(user).toBeDefined();

    expect(user).toHaveProperty("email");
    expect(typeof user.email).toBe("string");

    expect(user).toHaveProperty("subscription");
    expect(typeof user.subscription).toBe("string");
  });
});
