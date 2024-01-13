import User from "App/Models/User";
import Factory from "@ioc:Adonis/Lucid/Factory";

interface UserFactoryAttributes {
  password?: string;
}

export default Factory.define(
  User,
  ({ faker }, attributes: UserFactoryAttributes = {}) => {
    return {
      email: faker.internet.email(),
      password: attributes.password || faker.internet.password(),
    };
  }
).build();
