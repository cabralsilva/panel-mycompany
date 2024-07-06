import { AxiosResponse } from "axios";
import { apiMain } from "../../axios/ApiMain";
import { ISignaturePayment } from "../../models/ISignature";

class AddSignaturePaymentFlow {
  async exec(signatureId: string, payload: Partial<ISignaturePayment>): Promise<AxiosResponse<any, any>> {
    const response = await apiMain.patch(
      `/signature/${signatureId}/add-payment`,
      payload
    );
    return response
  }
}

export default new AddSignaturePaymentFlow