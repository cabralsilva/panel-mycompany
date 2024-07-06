import { AxiosResponse } from "axios";
import { apiMain } from "../../axios/ApiMain";
import { ISignaturePayment } from "../../models/ISignature";

class ConfirmSignaturePaymentFlow {
  async exec(signatureId: string, paymentId: string, payload: ISignaturePayment): Promise<AxiosResponse<any, any>> {
    const response = await apiMain.patch(
      `/signature/${signatureId}/confirm-payment/${paymentId}`,
      payload
    );
    return response
  }
}

export default new ConfirmSignaturePaymentFlow