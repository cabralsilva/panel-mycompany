import { Button, Col, Form, Modal, Row, notification } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import moment from "moment";
import DPInputDate2 from "../../../components/DPInputDate";
import UpdateSignatureFlow from "../../../flow/customer/UpdateSignatureFlow";
import { ICompany } from "../../../models/ICompany";
import { ISignature } from "../../../models/ISignature";
import "./styles.scss";

interface Props {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  company: ICompany;
}

const ChangeExpireDateModal = (props: Props) => {
  const { show, onHide, onConfirm, company } = props;
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [signature, setSignature] = useState<ISignature>();

  const [formChangeExpireDate] = Form.useForm();

  const onSubmit = async (values: any) => {
    console.log(values)
    setLoadingSubmit(true);
    try {
      await UpdateSignatureFlow.exec(signature?._id as string, values)
      notification.success({
        message: "Operação realizada com sucesso",
        description: `Cliente ${company.name} expira em ${moment(values.expireDate.$d).format("DD/MM/YYYY")}`,
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
      title="Alterar data de expiração"
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
          form={formChangeExpireDate}
          layout="vertical"
          onFinish={onSubmit}
        >
          <Row>
            <Col span={24}>
              <DPInputDate2
                form={formChangeExpireDate}
                name="expireDate"
                label="Data expiração"
                value={
                  signature?.expireDate ? dayjs(signature?.expireDate) : undefined
                }
              />
            </Col>
          </Row>
        </Form>
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
    </Modal>
  );
};

export default ChangeExpireDateModal;
