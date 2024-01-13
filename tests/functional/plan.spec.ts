import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { UserFactory } from "Database/factories";

test.group("Plan", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("create a plan", async ({ client, assert }) => {
    const user = await UserFactory.create();
    const response = await client
      .post("/plans")
      .json({
        name: "Test Plan",
      })
      .loginAs(user);

    console.log("RESPONSE BODY: ", response.body());

    assert.exists(response.body().id);
    assert.equal(response.body().user_id, user.id);
    assert.equal(response.body().name, "Test Plan");
  });
});
