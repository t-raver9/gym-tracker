import { test } from "@japa/runner";
import Database from "@ioc:Adonis/Lucid/Database";
import { UserFactory } from "Database/factories";

test.group("Register", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("register a user", async ({ client, assert }) => {
    const email = "test@test.com";
    const password = "password";

    const response = await client.post("/register").json({
      email: email,
      password: password,
    });

    assert.exists(response.body().user.id);
    assert.equal(response.body().user.email, email);
    assert.exists(response.body().token.type);
    assert.exists(response.body().token.token);
  });

  test("throws validation error if email not valid", async ({ client }) => {
    const email = "invalidEmail";
    const password = "password";

    const response = await client.post("/register").json({
      email: email,
      password: password,
    });

    response.assertStatus(422);
    response.assertBody({
      errors: [
        {
          rule: "email",
          field: "email",
          message: "email validation failed",
        },
      ],
    });
  });

  test("throws validation error if email already exists", async ({
    client,
  }) => {
    const user = await UserFactory.create();

    const response = await client.post("/register").json({
      email: user.email,
      password: "newPassword",
    });

    response.assertStatus(422);
    response.assertBody({
      errors: [
        {
          rule: "unique",
          field: "email",
          message: "unique validation failure",
        },
      ],
    });
  });
});
