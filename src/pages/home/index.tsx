import { HomeOutlined, LogoutOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Col, Layout, Menu, MenuProps, TablePaginationConfig, notification, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";

import { FilterValue } from "antd/es/table/interface";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import LogoDeupetch from "../../assets/svg/logo-label-white.svg?react";
import DPDateRange from "../../components/DPDateRange";
import DPFilters from "../../components/DPFilters";
import DPSearchText from "../../components/DPSearchText";
import DPSelectSearcher, { IItem } from "../../components/DPSelectSearcher";
import DPTable from "../../components/DPTable";
import SearchCustomerFlow from "../../flow/customer/SearchCustomerFlow";
import LogoutFlow from "../../flow/login/LogoutFlow";
import SearchPlanFlow from "../../flow/plan/SearchPlanFlow";
import { IAdminPlan } from "../../models/IAdminPlan";
import { ICompany } from "../../models/ICompany";
import { ISignature } from "../../models/ISignature";
import { phoneMask } from "../../utils";
import ChangeExpireDateModal from "./ChangeExpireDateModal";
import DetailCustomer from "./DetailCustomer";
import NewBilletModal from "./NewBilletModal";



export const HomePage = () => {

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [payloadTabelCustomers, setPayloadTabelCustomers] = useState<any>({})
  const [filtersCustomers, setFiltersCustomers] = useState<any>({})
  const [searching, setSearching] = useState<boolean>(false)
  const [tagsFilters, setTagsFilters] = useState<Map<string, JSX.Element>>(
    new Map([])
  );
  const [showModalChangeExpireDate, setShowModalChangeExpireDate] = useState<boolean>(false)
  const [showModalBillet, setShowModalBillet] = useState<boolean>(false)
  const [companySelected, setCompanySelected] = useState<ICompany>()
  const [counterRenderTable, setCounterRenderTable] = useState<number>(0)

  const navigate = useNavigate();

  const sideMenu: MenuProps['items'] = [
    {
      key: 'home',
      icon: React.createElement(HomeOutlined),
      label: "Home"
    },
    {
      key: 'logout',
      icon: React.createElement(LogoutOutlined),
      label: <Button style={{ color: "black" }} type="link" onClick={() => { LogoutFlow.exec(); navigate("/") }}>Logout</Button>
    },
  ]

  const searchCustomers = async (newFilters?: any) => {
    setSearching(true)
    try {

      const response = await SearchCustomerFlow.exec({
        ...filtersCustomers,
        ...newFilters
      })

      setPayloadTabelCustomers(response.data)
    } catch (error: any) {
      notification.warning({
        message: "Falha ao carregar clientes",
        description: error.message,
        duration: 5,
        placement: "topRight",
      })
    } finally {
      setSearching(false)
      setFiltersCustomers({
        ...filtersCustomers,
        ...newFilters
      })
    }
  }

  const handleSearchText = (searchText: string) => {
    searchCustomers({
      ...filtersCustomers,
      searchText,
      page: 1,
    });
  };
  const handleExpireDate = async (
    range: [Date | undefined, Date | undefined]
  ) => {
    let rangeAux = range.map((date: Date | undefined) => {
      if (date) {
        return moment(date).format("YYYY-MM-DD");
      }
      return null;
    }) as [string | null, string | null] | undefined;

    if (rangeAux?.every((value: string | null) => value === null)) {
      rangeAux = undefined
    }
    await searchCustomers({
      ...filtersCustomers,
      "signatures.expireDateRange": rangeAux,
      page: 1,
    });
  };

  const handlePlans = async (plansSelecteds: IItem[]) => {
    let plansAux = plansSelecteds.map((plan: IItem) => plan.key);
    await searchCustomers({
      ...filtersCustomers,
      "signatures.plan._id": plansAux as string[],
      page: 1,
    });
  };

  useEffect(() => {
    searchCustomers()
  }, [])

  let actions: Map<
    string,
    { enable: (item: any) => boolean; callback: (record: any) => any }
  > = new Map([]);
  actions.set("Editar data expiração", {
    callback: async (record: ICompany) => {
      setCompanySelected(record)
      setShowModalChangeExpireDate(true)
    },
    enable: (_item: ICompany) => true,
  });

  const expandedRowRender = (customer: ICompany) => {
    return (
      <DetailCustomer
        preFilters={{
          company: customer._id,
        }}
      />
    );
  };

  return (
    <Layout >
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Header style={{ display: 'flex', alignItems: 'center', padding: "10px" }}>
            <LogoDeupetch height={100} />
          </Header>
          <Menu
            mode="inline"
            defaultSelectedKeys={['home']}
            style={{ height: '100%', borderRight: 0, display: 'flex', flexDirection: 'column' }}
            items={sideMenu}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} items={[
            {
              title: "Panel"
            },
            {
              title: "Home"
            }
          ]}>
          </Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <DPFilters>
              <Col xs={24} sm={24} lg={5} xl={5} xxl={5}>
                <DPSearchText
                  _key="searchText"
                  label="Buscar..."
                  value={filtersCustomers.searchText}
                  callback={(
                    searchText: string,
                    tag: Map<string, JSX.Element | any>
                  ) => {
                    setTagsFilters(
                      new Map(tagsFilters).set("searchText", tag.get("searchText"))
                    );
                    handleSearchText(searchText);
                  }}
                />
              </Col>
              <Col xs={24} sm={24} lg={8} xl={5} xxl={5}>
                <DPDateRange
                  _key="signatures.expireDate"
                  label="Filtrar data expiração"
                  tagsPrefix="Expiração"
                  callback={(
                    range: [Date | undefined, Date | undefined],
                    tag: Map<string, JSX.Element | any>
                  ) => {
                    setTagsFilters(
                      new Map(tagsFilters).set(
                        "signatures.expireDate",
                        tag.get("signatures.expireDate")
                      )
                    );
                    handleExpireDate(range);
                  }}
                />
              </Col>
              <Col xs={24} sm={24} lg={5} xl={5} xxl={5}>
                <DPSelectSearcher
                  _key="plans"
                  label="Filtrar planos"
                  searcher={async (params: any) => {
                    let response = await SearchPlanFlow.exec({ ...params, select: ["name"] })
                    let items = (response.data.items as []).map(
                      (plan: IAdminPlan) => {
                        return {
                          key: plan._id,
                          label: `${plan.name}`,
                        };
                      }
                    ) as [];
                    return items;
                  }}
                  // initialValues={filters.brand}
                  callback={(
                    selections: IItem[],
                    tag: Map<string, JSX.Element | any>
                  ) => {
                    setTagsFilters(tagsFilters.set("plans", tag.get("plans")));
                    handlePlans(selections);
                  }}
                />
              </Col>
            </DPFilters>
            <DPTable
              key={counterRenderTable}
              name="customers"
              loading={searching}
              payload={payloadTabelCustomers}
              tags={tagsFilters}
              rowKey="_id"
              columns={[
                {
                  title: "Nome/Razão social",
                  dataIndex: "name",
                  key: "name",
                  sorter: true,
                  render: (
                    name: string,
                    record: ICompany,
                    _index: number
                  ) => {
                    return (
                      <>
                        {`${name}`}
                        <p className="dp-table-detail">Razão Social: {record?.tradeName}</p>
                        <p className="dp-table-detail">Hash: {record?._id}</p>
                      </>
                    );
                  },
                },
                {
                  title: "Criado em",
                  dataIndex: "createdAtDateTime",
                  key: "createdAtDateTime",
                  sorter: true,
                  render: (
                    createdAtDateTime: Date,
                    _record: ICompany,
                    _index: number
                  ) => {
                    return (
                      <>
                        {`${moment(createdAtDateTime).format("DD/MM/YYYY")}`}
                        <p className="dp-table-detail">{`${moment(createdAtDateTime).format("HH:mm")}`}</p>
                      </>
                    );
                  },
                },
                {
                  title: "Plano atual",
                  dataIndex: "signatures",
                  key: "signatures.plan.name",
                  sorter: true,
                  render: (
                    signatures: ISignature[],
                    _record: ICompany,
                    _index: number
                  ) => {
                    return (
                      <>
                        {`${(signatures[signatures.length - 1].plan as IAdminPlan).name}`}
                      </>
                    );
                  },
                },
                {
                  title: "Expira em",
                  dataIndex: "signatures",
                  key: "signatures.expireDate",
                  sorter: true,
                  render: (
                    signatures: ISignature[],
                    _record: ICompany,
                    _index: number
                  ) => {
                    return (
                      <>
                        {`${moment(signatures[signatures.length - 1].expireDate).format("DD/MM/YYYY")}`}
                      </>
                    );
                  },
                },
                {
                  title: "Contatos",
                  dataIndex: "phone",
                  key: "phone",
                  render: (
                    phone: string,
                    record: ICompany,
                    _index: number
                  ) => {
                    return (
                      <>
                        {`${phoneMask(phone)}`}
                        <p className="dp-table-detail">{`${record.email}`}</p>
                      </>
                    );
                  },
                },
              ]}
              onChange={(
                _pagination: TablePaginationConfig,
                filtersAux: Record<string, FilterValue | null>,
                sorter: any
              ) => {
                searchCustomers({
                  ...filtersCustomers,
                  ...filtersAux,
                  page: 1,
                  orderSense: sorter.order === "ascend" ? "asc" : "desc",
                  orderBy: sorter.columnKey,
                });
              }}
              onChangePage={(page: number) => {
                searchCustomers({ ...filtersCustomers, page });
              }}
              actions={
                new Map([
                  [
                    "Editar data expiração",
                    {
                      enable: () => true,
                      callback: (record: ICompany) => {
                        setCompanySelected(record)
                        setShowModalChangeExpireDate(true)
                      }
                    }
                  ],
                  [
                    "Novo boleto",
                    {
                      enable: () => true,
                      callback: (record: ICompany) => {
                        setCompanySelected(record)
                        setShowModalBillet(true)
                      }
                    }
                  ],
                ])
              }
              expandable={{
                expandedRowRender
              }}
            />

            {showModalChangeExpireDate && (
              <ChangeExpireDateModal
                show={showModalChangeExpireDate}
                company={companySelected as ICompany}
                onHide={() => {
                  setCompanySelected(undefined)
                  setShowModalChangeExpireDate(false)
                }}
                onConfirm={() => {
                  setCompanySelected(undefined)
                  setShowModalChangeExpireDate(false)
                  searchCustomers()
                  setCounterRenderTable(counterRenderTable + 1)
                }}
              />
            )}
            {showModalBillet && (
              <NewBilletModal
                show={showModalBillet}
                company={companySelected as ICompany}
                onHide={() => {
                  setCompanySelected(undefined)
                  setShowModalBillet(false)
                }}
                onConfirm={() => {
                  setCompanySelected(undefined)
                  setShowModalBillet(false)
                  searchCustomers()
                  setCounterRenderTable(counterRenderTable + 1)
                }}
              />
            )}
          </Content>
        </Layout>
      </Layout>
      <Footer style={{ textAlign: 'center' }}>
        Deupetch Panel ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  )
}