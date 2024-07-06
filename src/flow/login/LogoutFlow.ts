import { LS_USER_DATA } from "../../const";


class LogoutFlow {
  async exec() {
    localStorage.removeItem(LS_USER_DATA);
  }
}

export default new LogoutFlow