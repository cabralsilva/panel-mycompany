import { AxiosResponse } from "axios";
import { apiMain, prepareRequestParams } from "../../axios/ApiMain";

class SearchSignatureFlow {
  async exec(filters: any): Promise<AxiosResponse<any, any>> {
    const response = await apiMain.get(
      "/signature",
      prepareRequestParams(filters)
    );
    return response
  }
}

export default new SearchSignatureFlow