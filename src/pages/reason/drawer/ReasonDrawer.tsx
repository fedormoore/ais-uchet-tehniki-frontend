import React, {FC, useEffect, useState} from 'react';

import {Button, Col, Collapse, DatePicker, Drawer, Form, Input, InputNumber, Layout, Row, Space} from "antd";

import {useActions} from "../../../hooks/useActions";
import {ReasonModel} from "../../../models/ReasonModel";
import {ReasonActionCreators, reasonResult} from "../../../reducers/reason/reasonActionCreators";
import CounterpartySelect from "../../../components/ui/select/CounterpartySelect";
import OrganizationTreeSelect from "../../../components/ui/treeSelect/OrganizationTreeSelect";
import ReasonSpecDrawer from "./ReasonSpecDrawer";
import {Request} from "../../../http/network";
import {deleteRecord, saveRecord, undoRecord} from "../../../dataPreparation/local/reasonSpecLocal";
import dayjs from "dayjs";
import TableCustom from "../../../components/ui/table/TableCustom";
import {reasonSpecColumns} from "../../../components/ui/table/column/ReasonSpecColumns";
import CardView from "../../materialValueOrg/action/CardView";
import ButtonGroup, {buttonInterface, initButton} from "../../../components/ui/ButtonGroup";
import {MaterialValueOrgHistoryModel} from "../../../models/MaterialValueOrgHistoryModel";
import {UrlEnum} from "../../../constants/urlEnum";

const {Panel} = Collapse;

export type InterfaceType = 'contract' | 'statement';

interface ContractDrawerProps {
    openDrawer: boolean;
    closeDrawer: () => void;
    values: ReasonModel;
    viewContractSpec: boolean;
    interfaceType: InterfaceType;
}

const ReasonDrawer: FC<ContractDrawerProps> = (props) => {

    const localDateFormat = "DD.MM.YYYY";

    const [form] = Form.useForm();

    const {
        contractSaveToServer,
        statementSaveToServer,
        contractLoadFromServer,
        statementLoadFromServer
    } = useActions(ReasonActionCreators);

    const [values, setValues] = useState<ReasonModel>(props.values);

    const [contractSpecVisible, setContractSpecVisible] = useState<boolean>(false);
    const [button, setButton] = useState<buttonInterface>(initButton)

    const [contractSpecLoading, setContractSpecLoading] = useState<boolean>(true);

    const [selectRecord, setSelectRecord] = useState<MaterialValueOrgHistoryModel[]>([]);

    useEffect(() => {
        form.setFieldsValue(
            {
                '0date': dayjs(values.date),
                '0number': values.number,
                '0sum': values.sum,
                '0counterparty': values.counterparty?.id,
                '0organization': values.organization?.id
            }
        );
        if (values.id === undefined) {
            setValues({...values, date:dayjs(new Date()).format("YYYY-MM-DD")})
        }
        if (values.id !== undefined) {
            setContractSpecLoading(true);
            Request({
                url: UrlEnum.HistoryByReasonId + values.id,
                method: "GET"
            })
                .then((response: any) => {
                    if (response.isOk) {
                        setValues({...values, spec: response.data});
                        setContractSpecLoading(false);
                    } else {

                    }
                });
        } else {
            setContractSpecLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onClickSaveRecord = () => {
        form.validateFields()
            .then(() => {
                console.log(values)
                if (props.interfaceType === 'contract') {
                    (async function () {
                        const resultContract: reasonResult = await contractSaveToServer(values) as reasonResult;
                        if (resultContract.isOk) {
                            contractLoadFromServer();
                            props.closeDrawer();
                        }
                    })();
                } else {
                    (async function () {
                        const resultStatement: reasonResult = await statementSaveToServer(values) as reasonResult;
                        if (resultStatement.isOk) {
                            statementLoadFromServer();
                            props.closeDrawer();
                        }
                    })();
                }
            })
    }

    const contractSpecSave = (value: MaterialValueOrgHistoryModel[]) => {
        setValues({...values, spec: saveRecord(values.spec, value)});
    }

    const changeField = (name: string, value: any) => {
        setValues({...values, [name]: value});
    }

    return (
        <Drawer
            title={'Добавить запись'}
            width={'650px'}
            bodyStyle={{padding: "0px"}}
            closable={false}
            open={props.openDrawer}
            extra={
                <Space>
                    <Button onClick={props.closeDrawer}>Отмена</Button>
                    <Button type="primary" onClick={() => onClickSaveRecord()}>Сохранить</Button>
                </Space>
            }
        >
            <Form form={form} layout="vertical" preserve={false}>
                <CardView typeModel={"ReasonModel"} values={[values]}
                          viewField={(loadSelect: boolean, deletedRecord: boolean, index: number) =>
                              <>
                                  <Row gutter={24}>
                                      {/*Организация*/}
                                      <Col span={24}>
                                          <OrganizationTreeSelect load={true} buttonAdd={true} name={'0organization'}
                                                                  rulesOn={false} organizationType={'structure'}
                                                                  onChange={(value) => changeField("organization", value)}/>
                                      </Col>
                                  </Row>
                                  <Row gutter={24}>
                                      {/*Дата контракта*/}
                                      <Col span={8}>
                                          <Form.Item
                                              label={props.interfaceType === 'contract' ? "Дата контракта" : "Дата заявления"}
                                              name={'0date'}
                                              rules={[
                                                  {
                                                      required: true,
                                                      message: props.interfaceType === 'contract' ? "Укажите дату контракта" : "Укажите дату заявления"
                                                  }
                                              ]}
                                          >
                                              <DatePicker
                                                  style={{minWidth: '100%'}}
                                                  format={localDateFormat}
                                                  onChange={(date) => changeField("date", dayjs(date).format("YYYY-MM-DD"))}/>
                                          </Form.Item>
                                      </Col>
                                      {/*Номер контракта*/}
                                      <Col span={8}>
                                          <Form.Item
                                              label={props.interfaceType === 'contract' ? "Номер контракта" : "Номер заявления"}
                                              name={'0number'}
                                              rules={[
                                                  {
                                                      required: true,
                                                      message: props.interfaceType === 'contract' ? "Укажите номер контракта" : "Укажите номер заявления"
                                                  }
                                              ]}
                                          >
                                              <Input
                                                  onChange={e => changeField("number", e.target.value)}
                                              />
                                          </Form.Item>
                                      </Col>
                                      {/*Сумма контракта*/}
                                      {props.interfaceType === 'contract' &&
                                          <Col span={8}>
                                              <Form.Item
                                                  label="Сумма контракта"
                                                  name={'0sum'}
                                                  rules={[
                                                      {
                                                          required: true,
                                                          message: 'Укажите сумму контракта'
                                                      }
                                                  ]}
                                              >
                                                  <InputNumber style={{minWidth: '100%'}} min={0}
                                                               onChange={(value) => changeField("sum", Number(value))}
                                                  />
                                              </Form.Item>
                                          </Col>
                                      }
                                  </Row>
                                  {/*Поставщик*/}
                                  {props.interfaceType === 'contract' &&
                                      <Row gutter={24}>
                                          <Col span={24}>
                                              <CounterpartySelect load={true} buttonAdd={true} name={'0counterparty'}
                                                                  rulesOn={true}
                                                                  onChange={(value) => changeField("counterparty", value)}/>
                                          </Col>
                                      </Row>
                                  }
                                  {/*Состав*/}
                                  {props.viewContractSpec &&
                                      <Collapse>
                                          <Panel header={`Спецификация`} key={1}>
                                              <Layout className={"parentTable"} style={{maxHeight: "270px"}}>
                                                  <ButtonGroup button={{
                                                      ...button, buttonVoid: {
                                                          addRecord: () => {
                                                              setContractSpecVisible(true);
                                                              setSelectRecord([{} as MaterialValueOrgHistoryModel])
                                                              let buttonTmp = {
                                                                  ...button,
                                                                  buttonVisible: {
                                                                      ...button.buttonVisible,
                                                                      undoRecord: false,
                                                                      deleteRecord: true
                                                                  }, buttonDisable: {
                                                                      editRecord: true,
                                                                      deleteRecord: true
                                                                  }
                                                              }
                                                              setButton(buttonTmp)
                                                          },
                                                          deleteRecord: () => {
                                                              values.spec = deleteRecord(values.spec, values.spec.indexOf(selectRecord[0]));
                                                              setValues({...values});

                                                              setSelectRecord([{} as MaterialValueOrgHistoryModel])
                                                              let buttonTmp = {
                                                                  ...button,
                                                                  buttonVisible: {
                                                                      ...button.buttonVisible,
                                                                      undoRecord: false,
                                                                      deleteRecord: true
                                                                  }, buttonDisable: {
                                                                      editRecord: true,
                                                                      deleteRecord: true
                                                                  }
                                                              }
                                                              setButton(buttonTmp)
                                                          },
                                                          undoRecord: () => {
                                                              values.spec = undoRecord(values.spec, values.spec.indexOf(selectRecord[0]));
                                                              setValues({...values});

                                                              setSelectRecord([{} as MaterialValueOrgHistoryModel])
                                                              let buttonTmp = {
                                                                  ...button,
                                                                  buttonVisible: {
                                                                      ...button.buttonVisible,
                                                                      undoRecord: false,
                                                                      deleteRecord: true
                                                                  }, buttonDisable: {
                                                                      editRecord: true,
                                                                      deleteRecord: true
                                                                  }
                                                              }
                                                              setButton(buttonTmp)
                                                          }
                                                      }
                                                  }}/>
                                                  <TableCustom multiSelect={false} dataSource={values.spec}
                                                               columns={reasonSpecColumns({interfaceType: props.interfaceType})}
                                                               spinningLoading={contractSpecLoading}
                                                               selectChildren={false}
                                                               selectRecordIn={selectRecord}
                                                               returnSelectRecords={(selectRecordIn) => {
                                                                   let buttonTmp = {
                                                                       ...button,
                                                                       buttonVisible: {
                                                                           ...button.buttonVisible,
                                                                           undoRecord: selectRecordIn[0].deleted,
                                                                           deleteRecord: !selectRecordIn[0].deleted
                                                                       }, buttonDisable: {
                                                                           editRecord: selectRecordIn[0].deleted,
                                                                           deleteRecord: selectRecordIn[0].deleted
                                                                       }
                                                                   }
                                                                   setButton(buttonTmp)
                                                                   setSelectRecord(selectRecordIn);
                                                               }}
                                                  />
                                              </Layout>
                                          </Panel>
                                      </Collapse>
                                  }
                              </>}
                />


            </Form>
            {contractSpecVisible &&
                <ReasonSpecDrawer openDrawer={contractSpecVisible} interfaceType={props.interfaceType}
                                  selectRecords={values.spec}
                                  excludeRecordsByReasonId={values.id}
                                  closeDrawer={() => setContractSpecVisible(!contractSpecVisible)}
                                  saveRecord={(value) => contractSpecSave(value)}/>
            }
        </Drawer>
    );
};

export default ReasonDrawer;