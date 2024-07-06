import { Button, Col, Form, Modal, Row, notification } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import DPInputDate2 from "../../../components/DPInputDate";
import DPInputFileSingle from "../../../components/DPInputFileSingle";
import DPInputMoney from "../../../components/DPInputMoney";
import AddSignaturePaymentFlow from "../../../flow/customer/AddSignaturePaymentFlow";
import { ICompany } from "../../../models/ICompany";
import { ISignature, ISignaturePayment, PaymentMethodEnum } from "../../../models/ISignature";
import "./styles.scss";

interface Props {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  company: ICompany;
}

const NewBilletModal = (props: Props) => {
  const { show, onHide, onConfirm, company } = props;
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [signature, setSignature] = useState<ISignature>();

  const [formChangeExpireDate] = Form.useForm();

  const onSubmit = async (values: any) => {
    setLoadingSubmit(true);
    try {
      const payload = values as ISignaturePayment
      payload.paymentMethod = PaymentMethodEnum.PAYMENT_SLIP
      payload.billet = payload.billet ?? null
      payload.installments = 1
      await AddSignaturePaymentFlow.exec(signature?._id as string, values)
      notification.success({
        message: "Operação realizada com sucesso",
        description: `Novo boleto registrado para ${company.name}`,
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
    formChangeExpireDate.submit();
  };

  useEffect(() => {
    setSignature(company.signatures[company.signatures.length - 1])
  }, [])

  return (
    <Modal
      title={`Lançamento de boleto para ${company.name}`}
      open={show}
      onCancel={onHide}
      onOk={onOK}
      confirmLoading={loadingSubmit}
      destroyOnClose
      footer={null}
      width="600px"
    >
      <Form
        form={formChangeExpireDate}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Row>

          <Col span={24}>
            <DPInputFileSingle
              accept=".pdf"
              form={formChangeExpireDate}
              name="billet"
              label="Boleto em pdf"
              listType="picture-card"
              rules={[
                {
                  required: true,
                  message: "Campo obrigatório"
                }
              ]}
            />
          </Col>
          <Col span={12}>
            <DPInputDate2
              form={formChangeExpireDate}
              name="dueDate"
              label="Data vencimento"
              value={
                signature?.expireDate ? dayjs(signature?.expireDate) : undefined
              }
              rules={[
                {
                  required: true,
                  message: "Campo obrigatório"
                }
              ]}
            />
          </Col>
          <Col span={12}>
            <DPInputMoney
              form={formChangeExpireDate}
              label="Valor do boleto"
              name="value"
              rules={[
                {
                  required: true,
                  message: "Campo obrigatório"
                }
              ]}
            />
          </Col>
        </Row>
        <Row justify="end">
          <Col span={6}>
            <Button
              type="primary"
              onClick={onOK}
              loading={loadingSubmit}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              Salvar
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default NewBilletModal;
