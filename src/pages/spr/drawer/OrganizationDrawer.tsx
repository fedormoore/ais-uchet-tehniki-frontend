import React, {FC, useEffect, useState} from 'react';

import {Button, Col, Collapse, Drawer, Form, Input, Layout, Row, Space} from "antd";

import {useActions} from "../../../hooks/useActions";

import {
    OrganizationActionCreators,
    organizationResult
} from "../../../reducers/spr/organization/organizationActionCreators";
import OrganizationTypeSelect from "../../../components/ui/select/OrganizationTypeSelect";
import {OrganizationModel} from "../../../models/spr/OrganizationModel";
import ButtonGroup, {buttonInterface, initButton} from "../../../components/ui/ButtonGroup";
import {deleteRecord, organizationSaveRecord, undoRecord} from "../../../dataPreparation/local/organizationLocal";
import TableCustom from "../../../components/ui/table/TableCustom";
import {organizationColumns} from "../../../components/ui/table/column/OrganizationColumns";
import CardView from "../../materialValueOrg/action/CardView";

const {Panel} = Collapse;

interface OrganizationDrawerProps {
    organizationOpenDrawer: boolean;
    organizationCloseDrawer: () => void;
    organizationValues: OrganizationModel;
    saveChildren?: (value: OrganizationModel[]) => void;
}

interface OrganizationChildrenSelectRecord {
    selectRecord: OrganizationModel[];
}

let indexGlobal: number;

const OrganizationDrawer: FC<OrganizationDrawerProps> = (props) => {

    const [form] = Form.useForm();

    const {loadOrganization, saveOrganization} = useActions(OrganizationActionCreators);

    const [values, setValues] = useState<OrganizationModel[]>([Object.assign([], props.organizationValues)]);

    const [organizationChildrenSelectRecord, setOrganizationChildrenSelectRecord] = useState<OrganizationChildrenSelectRecord[]>([{
        selectRecord: [{} as OrganizationModel]
    }]);

    const [button, setButton] = useState<buttonInterface[]>([initButton])

    const [visibleOrganizationDrawer, setVisibleOrganizationDrawer] = useState<boolean>(false);

    useEffect(() => {
        form.setFieldsValue(
            {
                '0type': values[0].type,
                '0name': values[0].name,
                '0children': values[0].children
            }
        );

        button[0] = {
            ...button[0], buttonVisible: {...button[0].buttonVisible}, buttonDisable: {
                ...button[0].buttonDisable, addRecord: values[0].type === undefined
            }
        }
        setButton([...button])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onClickSaveRecord = () => {
        form.validateFields()
            .then(() => {
                (async function () {
                    const result: organizationResult = await saveOrganization(values) as organizationResult;
                    if (result.isOk) {
                        loadOrganization();
                        props.organizationCloseDrawer();
                    }
                })();
            })
    }

    const onClickSaveChildren = (value: OrganizationModel[]) => {
        values[indexGlobal].children = organizationSaveRecord(values[indexGlobal].children!, value);
        setValues(values)
    }

    const onClickAddField = () => {
        setValues([...values.concat({} as OrganizationModel)]);
        button.push(initButton)
        organizationChildrenSelectRecord.push({selectRecord: []})
    }

    const viewAddField = () => {

        const changeField = (index: number, name: string, value: any) => {
            values[index] = {...values[index], [name]: value};
            setValues([...values])
            const buttonDisable=(values[index].type !== '' && values[index].type !== undefined)&& (values[index].name !== '' && values[index].name !== undefined)

            button[index] = {
                ...button[index], buttonVisible: {...button[index].buttonVisible}, buttonDisable: {...button[index].buttonDisable, addRecord:!buttonDisable}
            }
            setButton([...button])
        }

        const removeField = (event: any, index: number) => {
            event.stopPropagation()

            button.splice(index, 1);
            setButton([...button])

            organizationChildrenSelectRecord.splice(index, 1);
            setOrganizationChildrenSelectRecord([...organizationChildrenSelectRecord])

            values.splice(index, 1);
            setValues([...values])

            for (let i = 0; i < values.length; i++) {
                form.setFieldsValue(
                    {
                        [i + 'type']: values[i].type,
                        [i + 'name']: values[i].name,
                        [i + 'children']: values[i].children
                    }
                );
            }
        }

        return (
            <CardView typeModel={"OrganizationModel"} values={values}
                      removeField={(event: React.MouseEvent, index: number) => removeField(event, index)}
                      viewField={(loadSelect: boolean, deletedRecord: boolean, index: number) =>
                          <>
                              <Row gutter={24}>
                                  <Col span={24}>
                                      <OrganizationTypeSelect load={loadSelect} name={index + 'type'}
                                                              rulesOn={true}
                                                              onChange={(value) => changeField(index, "type", value)}/>
                                  </Col>
                                  <Col span={24}>
                                      <Form.Item
                                          label="Наименование"
                                          name={index + 'name'}
                                          rules={[
                                              {
                                                  required: true,
                                                  message: 'Пожалуйста укажите наименование'
                                              }
                                          ]}
                                      >
                                          <Input
                                              onChange={e => changeField(index, "name", e.target.value)}
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={24}>
                                      {/*Состав*/}
                                      <Collapse>
                                          <Panel header={`В составе`} key={1}>
                                              <Layout className={"parentTable"} style={{maxHeight: "270px"}}>
                                                  <ButtonGroup button={{
                                                      ...button[index], buttonVoid: {
                                                          addRecord: () => {
                                                              indexGlobal = index;
                                                              setVisibleOrganizationDrawer(true);
                                                              organizationChildrenSelectRecord[index] = {
                                                                  selectRecord: [{} as OrganizationModel]
                                                              }
                                                              setOrganizationChildrenSelectRecord(organizationChildrenSelectRecord)
                                                          },
                                                          editRecord: () => {
                                                              indexGlobal = index;
                                                              setVisibleOrganizationDrawer(true);
                                                          },
                                                          deleteRecord: () => {
                                                              values[index].children = deleteRecord(values[index].children, values[index].children.indexOf(organizationChildrenSelectRecord[index].selectRecord[0]));
                                                              setValues([...values]);

                                                              organizationChildrenSelectRecord[index] = {
                                                                  selectRecord: []
                                                              }
                                                              setOrganizationChildrenSelectRecord(organizationChildrenSelectRecord)

                                                              button[index] = {
                                                                  ...button[index], buttonVisible: {...button[index].buttonVisible,
                                                                      undoRecord: true,
                                                                      deleteRecord: false
                                                                  }, buttonDisable: {...button[index].buttonDisable, deleteRecord: true, undoRecord: true}
                                                              }
                                                              setButton([...button])
                                                          },
                                                          undoRecord: () => {
                                                              values[index].children = undoRecord(values[index].children, values[index].children.indexOf(organizationChildrenSelectRecord[index].selectRecord[0]));
                                                              setValues([...values]);

                                                              organizationChildrenSelectRecord[index] = {
                                                                  selectRecord: []
                                                              }
                                                              setOrganizationChildrenSelectRecord(organizationChildrenSelectRecord)

                                                              button[index] = {
                                                                  ...button[index], buttonVisible: {...button[index].buttonVisible,
                                                                      undoRecord: false,
                                                                      deleteRecord: true
                                                                  }, buttonDisable: {...button[index].buttonDisable, deleteRecord: true, undoRecord: true}
                                                              }
                                                              setButton([...button])
                                                          }
                                                      }
                                                  }}/>
                                                  <TableCustom multiSelect={false} expandable={true}
                                                               dataSource={values[index].children}
                                                               columns={organizationColumns}
                                                               spinningLoading={false} selectChildren={false}
                                                               selectRecordIn={organizationChildrenSelectRecord[index].selectRecord}
                                                               returnSelectRecords={(selectRecordIn) => {
                                                                   organizationChildrenSelectRecord[index] = {
                                                                       selectRecord: selectRecordIn
                                                                   }
                                                                   button[index] = {
                                                                       ...button[index], buttonVisible: {...button[0].buttonVisible,
                                                                           undoRecord: selectRecordIn[0].deleted,
                                                                           deleteRecord: !selectRecordIn[0].deleted
                                                                       }, buttonDisable: {
                                                                           editRecord: selectRecordIn[0].deleted,
                                                                           deleteRecord: selectRecordIn[0].deleted
                                                                       }
                                                                   }
                                                                   setButton([...button])
                                                               }}
                                                               returnDoubleClick={() => {
                                                                   if (!organizationChildrenSelectRecord[index].selectRecord[0].deleted) {
                                                                       indexGlobal = index;
                                                                       setVisibleOrganizationDrawer(true);
                                                                   }
                                                               }}
                                                  />
                                              </Layout>
                                          </Panel>
                                      </Collapse>
                                  </Col>
                              </Row>
                          </>}
            />
        )
    }

    return (
        <Drawer
            title={values[0].id !== undefined ? 'Редактировать запись' : 'Добавить запись'}
            width={'500px'}
            bodyStyle={{padding: "0px"}}
            closable={false}
            open={props.organizationOpenDrawer}
            extra={
                <Space>
                    <Button onClick={props.organizationCloseDrawer}>Отмена</Button>
                    {values[0].id === undefined &&
                        <Button onClick={() => onClickAddField()}>Добавить</Button>}
                    <Button type="primary" onClick={() => {
                        if (props.saveChildren === undefined) {
                            onClickSaveRecord()
                        } else {
                            form.validateFields()
                                .then(() => {
                                    props.saveChildren?.(values)
                                    props.organizationCloseDrawer();
                                })
                        }
                    }}>
                        Сохранить
                    </Button>
                </Space>
            }
        >
            <Form form={form} layout="vertical" preserve={false}>
                {viewAddField()}
            </Form>
            {visibleOrganizationDrawer &&
                <OrganizationDrawer organizationOpenDrawer={visibleOrganizationDrawer}
                                    saveChildren={(value) => onClickSaveChildren(value)}
                                    organizationCloseDrawer={() => setVisibleOrganizationDrawer(!visibleOrganizationDrawer)}
                                    organizationValues={organizationChildrenSelectRecord[indexGlobal].selectRecord[0]}/>
            }
        </Drawer>
    );
};

export default OrganizationDrawer;