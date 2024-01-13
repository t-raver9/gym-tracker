import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Plan from "App/Models/Plan";
import PlanVersion from "App/Models/PlanVersion";
import PlanValidator from "App/Validators/PlanValidator";

export default class PlansController {
  public async create({ auth, request, response }: HttpContextContract) {
    const payload = await request.validate(PlanValidator);

    const trx = await Database.transaction();

    try {
      const plan = await new Plan().merge({
        ...payload,
        userId: auth.user?.id,
      });

      await plan.useTransaction(trx).save();

      const planVersion = await new PlanVersion();
      planVersion.fill({
        planId: plan.id,
        isActive: true,
        versionNum: 1,
      });
      await planVersion.useTransaction(trx).save();

      await trx.commit();
      return response.json(plan);
    } catch (e: any) {
      await trx.rollback();
      throw e;
    }
  }
}
