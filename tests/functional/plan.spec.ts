import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { UserFactory } from "Database/factories";
import PlanVersion from "App/Models/PlanVersion";

test.group("Plan", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test("create a plan, which also creates a plan version", async ({
    client,
    assert,
  }) => {
    const user = await UserFactory.create();
    const response = await client
      .post("/plans")
      .json({
        name: "Test Plan",
      })
      .loginAs(user);

    assert.exists(response.body().id);
    assert.equal(response.body().user_id, user.id);
    assert.equal(response.body().name, "Test Plan");

    // Get all
    const planVersion = await PlanVersion.query().where(
      "plan_id",
      response.body().id
    );

    assert.equal(planVersion.length, 1);
    assert.equal(planVersion[0].planId, response.body().id);
    assert.equal(planVersion[0].isActive, true);
  });
});
