import { OK } from "http-status";
import { apiMain } from "../../axios/ApiMain";
import { LS_USER_DATA } from "../../const";
import { ICredentials } from "../../models/ICredentials";
import LogoutFlow from "./LogoutFlow";

class LoginFlow {
  async exec(credentials: ICredentials) {
    const response = await apiMain.post(
      "/auth",
      {},
      {
        auth: credentials,
      }
    );

    if (response.status === OK) {
      localStorage.setItem(LS_USER_DATA, JSON.stringify(response.data));
      return
    }

    LogoutFlow.exec();
    throw new Error(response.data.message)
  }
}

export default new LoginFlow