import { Button, Col, Form, Modal, Row, notification } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

import DPInputDate2 from "../../../components/DPInputDate";
import DPInputMoney from "../../../components/DPInputMoney";
import ConfirmSignaturePaymentFlow from "../../../flow/customer/ConfirmSignaturePaymentFlow";
import { ISignature, ISignaturePayment } from "../../../models/ISignature";
import "./styles.scss";

interface Props {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  signature: ISignature;
  payment: ISignaturePayment;
}

const ConfirmPaymentModal = (props: Props) => {
  const { show, onHide, onConfirm, signature, payment } = props;
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  
  const [formSettledPayment] = Form.useForm();

  const onSubmit = async (values: any) => {
    setLoadingSubmit(true);
    try {
      await ConfirmSignaturePaymentFlow.exec(signature._id, payment._id, values)
      notification.success({
        message: "Operação realizada com sucesso",
        description: `Pagamento confirmado com sucesso`,
        duration: 5,
        placement: "topRight",
      })
      onConfirm();
      onHide();
    } catch (error: any) {
      notification.warning({
        message: "Falha ao atualizar data de expiração",
        description: error.message,
        duration: 5,
        placement: "topRight",
      })
    } finally {
      setLoadingSubmit(false);
    }
  };

  const onOK = async () => {
    formSettledPayment.submit();
  };

  return (
    <Modal
      title="Confirmação de pagamento"
      open={show}
      onCancel={onHide}
      onOk={onOK}
      confirmLoading={loadingSubmit}
      destroyOnClose
      footer={null}
      width="600px"
    >
      <Row>
        <Form
          form={formSettledPayment}
          layout="vertical"
          onFinish={onSubmit}
        >
          <Row>
            <Col span={12}>
              <DPInputMoney
                form={formSettledPayment}
                name="value"
                label="Valor"
                value={
                  payment.value
                }
                disabled
              />
            </Col>
            <Col span={12}>
              <DPInputDate2
                form={formSettledPayment}
                name="paymentDate"
                label="Data pagamento"
                value={
                  payment?.paymentDate ? dayjs(payment?.paymentDate) : undefined
                }
                rules={[
                  {
                    required: true,
                    message: "Campo obrigatório"
                  }
                ]}
              />
            </Col>
          </Row>
        </Form>
      </Row>
      <Row justify="end">
        <Col>
          <Button
            type="primary"
            onClick={onOK}
            loading={loadingSubmit}
            className="dp-button"
          >
            Confirmar pagamento
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};

export default ConfirmPaymentModal;
