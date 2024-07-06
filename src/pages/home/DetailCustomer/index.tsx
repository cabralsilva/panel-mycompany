import { Col, Row, notification } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

import DPTable from "../../../components/DPTable";
import SearchSignatureFlow from "../../../flow/customer/SearchSignatureFlow";
import { IAdminPlan } from "../../../models/IAdminPlan";
import { ISignature, SignaturePlainPeriod, SignaturePlainPeriodTranslate, SignatureStatus, SignatureStatusTranslate } from "../../../models/ISignature";
import DetailPayments from "./DetailPayments";

interface ICustomProps {
  preFilters: any;
}

const DetailCustomer = (props: ICustomProps) => {
  const { preFilters } = props;

  const [loadingSignatures, setLoadingTable] = useState<boolean>(false);

  const [filtersSignatures, setFiltersSignatures] = useState<any>({
    ...preFilters,
    populate: ["plan"],
    pageable: false,
    orderSense: "asc",
    orderBy: "_id",
  });

  const [signatures, setSignatures] = useState<ISignature[]>([]);

  const searchSignatures = async (filtersAux: any) => {
    setLoadingTable(true);
    try {
      let response = await SearchSignatureFlow.exec({
        ...filtersSignatures,
        ...filtersAux
      })

      setSignatures(response.data.items)
    } catch (error: any) {
      notification.warning({
        message: "Falha ao carregar assinaturas do cliente",
        description: error.message,
        duration: 5,
        placement: "topRight",
      })
    } finally {
      setLoadingTable(false);
      setFiltersSignatures({
        ...filtersSignatures,
        ...filtersAux
      })
    }
  };

  useEffect(() => {
    searchSignatures(filtersSignatures);
  }, []);

  const expandedRowRender = (signature: ISignature) => {
    return (
      <DetailPayments
        payments={signature.payments}
        signature={signature}
        onUpdate={() => {
          searchSignatures(filtersSignatures);
        }}
      />
    );
  };

  return (
    <Row>
      <Col span={16}>
        <DPTable
          name="Assinaturas"
          showName
          loading={loadingSignatures}
          columns={[
            {
              title: "Plano",
              dataIndex: "plan",
              key: "plan.name",
              render: (plan: IAdminPlan, _record: ISignature, _index: number) => (

                <>
                  {plan.name}
                </>
              )
            },
            {
              title: "Criado em",
              dataIndex: "createdAtDateTime",
              key: "createdAtDateTime",
              render: (createdAtDateTime: Date, _record: ISignature, _index: number) => (

                <>
                  {moment(createdAtDateTime).format("DD/MM/YYYY")}
                  <p className="dp-table-detail">
                    {moment(createdAtDateTime).format("hh:mm")}
                  </p>
                </>
              )
            },
            {
              title: "Periodicidade",
              dataIndex: "period",
              key: "period",
              render: (period: SignaturePlainPeriod, _record: ISignature, _index: number) => (

                <>
                  {period ? SignaturePlainPeriodTranslate[period] : "Não aplicado"}
                </>
              )
            },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              render: (status: SignatureStatus, _record: ISignature, _index: number) => (

                <>
                  {status ? SignatureStatusTranslate[status] : "Não aplicado"}
                </>
              )
            },
          ]}
          payload={{ items: signatures }}
          rowKey="_id"

          expandable={{
            expandedRowRender
          }}
        />
      </Col>
    </Row>
  );
};

export default DetailCustomer;
