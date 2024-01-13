import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import RegisterValidator from "App/Validators/RegisterValidator";

export default class AuthController {
  public async register({ auth, request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(RegisterValidator);
      const user = await User.create(payload);
      const token = await auth.use("api").generate(user);

      const registerResponse = {
        user: {
          id: user.id,
          email: user.email,
        },
        token: token,
      };

      return response.json(registerResponse);
    } catch (e: any) {
      if (e.code == "E_VALIDATION_FAILURE") {
        return response.status(422).send(e.messages);
      }
      return response.status(500).json({
        message: "Registration failed",
        error: e.message,
      });
    }
  }
}
