import { AxiosResponse } from "axios";
import { apiMain, prepareRequestParams } from "../../axios/ApiMain";

class SearchCustomerFlow {
  async exec(filters: any): Promise<AxiosResponse<any, any>> {
    const response = await apiMain.get(
      "/company",
      prepareRequestParams(filters)
    );
    return response
  }
}

export default new SearchCustomerFlow