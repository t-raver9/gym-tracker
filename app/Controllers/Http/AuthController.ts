import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import LoginValidator from "App/Validators/LoginValidator";
import RegisterValidator from "App/Validators/RegisterValidator";

export default class AuthController {
  public async register({ auth, request, response }: HttpContextContract) {
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
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const { email, password } = await request.validate(LoginValidator);
    const token = await auth.use("api").attempt(email, password);

    return response.json(token);
  }
}
