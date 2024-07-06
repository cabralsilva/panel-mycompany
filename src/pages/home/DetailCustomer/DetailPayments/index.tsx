import { Button, Col, Row } from "antd";
import moment from "moment";

import { useState } from "react";
import DPTable from "../../../../components/DPTable";
import { ISignature, ISignaturePayment, PaymentStatusEnum, PaymentStatusEnumTranslate } from "../../../../models/ISignature";
import { toMoneyBR } from "../../../../utils";
import ConfirmPaymentModal from "../../ConfirmPaymentModal";

interface ICustomProps {
  payments: ISignaturePayment[];
  signature: ISignature;
  onUpdate: () => void
}

const DetailPayments = (props: ICustomProps) => {
  const { payments, signature, onUpdate } = props;

  const [showModalConfirmPayment, setShowModalConfirmPayment] = useState<boolean>(false);
  const [paymentSelected, setPaymentSelected] = useState<ISignaturePayment>();


  return (
    <Row>
      <Col span={24}>
        <DPTable
          name="Pagamentos"
          showName
          columns={[
            {
              title: "Valor",
              dataIndex: "value",
              key: "value",
              render: (value: number, _record: ISignaturePayment, _index: number) => (
                <>
                  {toMoneyBR(value)}
                </>
              )
            },
            {
              title: "Vencimento",
              dataIndex: "dueDate",
              key: "dueDate",
              render: (dueDate: Date, _record: ISignaturePayment, _index: number) => (
                <>
                  {moment(dueDate).format("DD/MM/YYYY")}
                </>
              )
            },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              render: (status: PaymentStatusEnum, _record: ISignaturePayment, _index: number) => (

                <>
                  {status ? PaymentStatusEnumTranslate[status] : "Não aplicado"}
                </>
              )
            },
            {
              title: "Ações",
              key: "action",
              render: (_: any, _record: ISignaturePayment, _index: number) => (
                <>
                  {_record.status === PaymentStatusEnum.PENDING && (
                    <>
                      <Button className="dp-button" type="primary" onClick={() => {
                        setPaymentSelected(_record)
                        setShowModalConfirmPayment(true)
                      }}>Confirm. pagamento</Button>
                      {/* <Button className="dp-button" type="default">Cancelar</Button> */}
                    </>
                  )}
                </>
              )
            },
          ]}
          payload={{ items: payments }}
          rowKey="_id"
        />
      </Col>
      {showModalConfirmPayment && (
        <ConfirmPaymentModal
          show={showModalConfirmPayment}
          payment={paymentSelected as ISignaturePayment}
          signature={signature}
          onHide={() => {
            setPaymentSelected(undefined)
            setShowModalConfirmPayment(false)
          }}
          onConfirm={() => {
            setPaymentSelected(undefined)
            setShowModalConfirmPayment(false)
            onUpdate()
          }}
        />
      )}
    </Row>
  );
};

export default DetailPayments;
