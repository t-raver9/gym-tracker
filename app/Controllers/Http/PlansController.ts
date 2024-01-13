import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Plan from "App/Models/Plan";
import PlanValidator from "App/Validators/PlanValidator";

export default class PlansController {
  public async create({ auth, request, response }: HttpContextContract) {
    const payload = await request.validate(PlanValidator);

    const plan = await new Plan()
      .merge({ ...payload, userId: auth.user?.id })
      .save();
    return response.json(plan);
  }
}
