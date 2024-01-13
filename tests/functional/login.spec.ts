import { test } from "@japa/runner";
import Database from "@ioc:Adonis/Lucid/Database";
import { UserFactory } from "Database/factories";

test.group("Login", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("login a user", async ({ client, assert }) => {
    const user = await UserFactory.merge({ password: "myPassword" }).create();

    const response = await client.post("/login").json({
      email: user.email,
      password: "myPassword",
    });

    assert.exists(response.body().token);
    assert.exists(response.body().type);
  });
  test("throws error when logging in with the wrong password", async ({
    client,
  }) => {
    const user = await UserFactory.merge({ password: "myPassword" }).create();

    const response = await client.post("/login").json({
      email: user.email,
      password: "wrongPassword",
    });

    response.assertStatus(400);
    response.assertBody({
      errors: [
        {
          message: "E_INVALID_AUTH_PASSWORD: Password mis-match",
        },
      ],
    });
  });
});
