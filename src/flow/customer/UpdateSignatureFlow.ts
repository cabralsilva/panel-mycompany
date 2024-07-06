import { AxiosResponse } from "axios";
import { apiMain } from "../../axios/ApiMain";
import { ISignature } from "../../models/ISignature";

class UpdateSignatureFlow {
  async exec(signatureId: string, payload: Partial<ISignature>): Promise<AxiosResponse<any, any>> {
    const response = await apiMain.patch(
      `/signature/${signatureId}`,
      payload
    );
    return response
  }
}

export default new UpdateSignatureFlow