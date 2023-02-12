import React, {FC, useState} from 'react';

import {
    Button,
    Col,
    Collapse,
    Divider,
    Drawer,
    Form,
    Input,
    InputNumber,
    Layout,
    Modal,
    Row,
    Space,
    Tooltip
} from "antd";

import {useActions} from "../../../hooks/useActions";

import {CopyOutlined, DeleteOutlined} from "@ant-design/icons";
import {IncomeChildrenModel, IncomeModel, IncomeSpecificationModel} from "../../../models/materialValueOrg/IncomeModel";
import MaterialValueSprSelect from "../../../components/ui/select/MaterialValueSprSelect";
import {
    MaterialValueOrgActionCreators,
    storageResult,
} from "../../../reducers/materialValueOrg/materialValueOrgActionCreators";
import IncomeChildrenDrawer from "./IncomeChildrenDrawer";
import {incomeDeleteRecord, incomeSaveRecord} from "../../../dataPreparation/local/incomeLocal";
import UserSelect from "../../../components/ui/select/UserSelect";
import BudgetAccountSelect from "../../../components/ui/select/BudgetAccountSelect";
import OrganizationTreeSelect from "../../../components/ui/treeSelect/OrganizationTreeSelect";
import ReasonSelect from "../../../components/ui/select/ReasonSelect";
import {AppActionCreators} from "../../../reducers/app/appActionCreators";
import {getDeviceName} from "../../../components/storage";
import LocationTreeSelect from "../../../components/ui/treeSelect/LocationTreeSelect";
import TableCustom from "../../../components/ui/table/TableCustom";
import {incomeDrawer} from "../../../components/ui/table/column/IncomeDrawer";
import ButtonGroup, {buttonInterface, initButton} from "../../../components/ui/ButtonGroup";

const {Panel} = Collapse;

interface IncomeDrawerProps {
    openDrawer: boolean;
    closeDrawer: () => void;
}

interface IncomeDrawerSetting {
    copyRecord: number;
}

let indexSpecificationGlobal: number;

const IncomeDrawer: FC<IncomeDrawerProps> = (props) => {

    const [formMain] = Form.useForm();
    const [formSpe] = Form.useForm();

    const {setNotification} = useActions(AppActionCreators);
    const {saveIncome, storageLoadFromServer} = useActions(MaterialValueOrgActionCreators);

    const [values, setValues] = useState<IncomeModel>({spec: [{} as IncomeSpecificationModel]} as IncomeModel);
    const [incomeChildrenVisible, setIncomeChildrenVisible] = useState<boolean>(false);

    const [incomeDrawerSetting, setIncomeDrawerSetting] = useState<IncomeDrawerSetting[]>([{
        copyRecord: 1
    }]);

    const [button, setButton] = useState<buttonInterface[]>([{
        ...initButton,
        buttonVisible: {...initButton.buttonVisible, editRecord: true},
        buttonDisable: {...initButton.buttonDisable, addRecord: true, editRecord: true, deleteRecord: true}
    }])

    const [incomeDrawerSelectRecord, setIncomeDrawerSelectRecord] = useState<IncomeChildrenModel[]>([{} as IncomeChildrenModel]);

    const onClickSaveRecord = () => {
        formMain.validateFields()
            .then(() => {
                formSpe.validateFields()
                    .then(() => {
                        (async function () {
                            const result: storageResult = await saveIncome(values) as storageResult;
                            if (result.isOk) {
                                storageLoadFromServer();
                                props.closeDrawer();
                            }
                        })();
                    })
                    .catch(() => {
                        setNotification({
                            type: "error",
                            message: "Ошибка",
                            description: "Не все обязательные поля в номенклатуре заполнены"
                        })
                    })
            })
            .catch(() => {
                setNotification({
                    type: "error",
                    message: "Ошибка",
                    description: "Не все обязательные поля заполнены"
                })
            })
    }

    const onClickAddField = () => {
        values.spec = values.spec.concat({} as IncomeSpecificationModel);
        setValues({...values})

        button.push(initButton)
        incomeDrawerSetting.push({copyRecord: 1})
        incomeDrawerSelectRecord.push({} as IncomeChildrenModel)
    }

    const viewAddField = () => {

        const changeField = (index: number, name: string, value: any) => {
            if (name === 'materialValue') {
                let buttonAddDisable: boolean = value !== undefined ? !value.materialValueType.addOther : true
                button[index].buttonDisable.addRecord = buttonAddDisable;
                setButton([...button])
            }
            values.spec[index] = {...values.spec[index], [name]: value};
            setValues({...values})
        }

        const removeField = (event: any, index: number) => {
            event.stopPropagation()

            values.spec.splice(index, 1);

            refreshField(values.spec);

            incomeDrawerSetting.splice(index, 1);
            setIncomeDrawerSetting([...incomeDrawerSetting])

            button.splice(index, 1);
            setButton([...button])

            incomeDrawerSelectRecord.splice(index, 1);
            setIncomeDrawerSelectRecord([...incomeDrawerSelectRecord])
        }

        const copyField = (index: number) => {
            formSpe.validateFields()
                .then(() => {
                    let newArrValue = [...values.spec];
                    for (let i = 0; i < incomeDrawerSetting[index].copyRecord; i++) {
                        newArrValue = newArrValue.concat(values.spec[index]);

                        incomeDrawerSetting.push({copyRecord: 1})
                        setIncomeDrawerSetting(incomeDrawerSetting)
                        button.push(initButton)

                        incomeDrawerSelectRecord.push({} as IncomeChildrenModel)
                    }

                    setValues({...values, spec: newArrValue});
                    refreshField(newArrValue);
                })
                .catch(() => {
                    setNotification({
                        type: "error",
                        message: "Ошибка",
                        description: "Не все обязательные поля в номенклатуре заполнены. Номер записи " + (index + 1)
                    })
                })
        }

        const refreshField = (newArr: IncomeSpecificationModel[]) => {
            for (let i = 0; i < newArr.length; i++) {
                formSpe.setFieldsValue(
                    {
                        [i + 'materialValue']: newArr[i].materialValue?.id,
                        [i + 'sum']: newArr[i].sum,
                        [i + 'budgetAccount']: newArr[i].budgetAccount?.id,
                        [i + 'children']: newArr[i].children
                    }
                );
            }
        }

        const x = (indexSpecification: number, selectRecordIn: any, deleteRecordIn: boolean) => {
            indexSpecificationGlobal = indexSpecification;

            incomeDrawerSelectRecord[indexSpecification] = selectRecordIn
            setIncomeDrawerSelectRecord([...incomeDrawerSelectRecord])

            button[indexSpecification] = {
                ...button[indexSpecification],
                buttonVisible: {...button[indexSpecification].buttonVisible},
                buttonDisable: {
                    ...button[indexSpecification].buttonDisable,
                    editRecord: deleteRecordIn,
                    deleteRecord: deleteRecordIn
                }
            }
            setButton([...button])
        }

        return (
            <>
                {values.spec.map((item, indexSpecification) => {
                    let deletedRecord: boolean = false
                    let loadSelect: boolean = true
                    if (indexSpecification !== 0) {
                        deletedRecord = true
                        loadSelect = false
                    }

                    return (
                        <div key={indexSpecification}>
                            <Collapse defaultActiveKey={1}>
                                <Panel
                                    header={getDeviceName(values.spec[indexSpecification].materialValue) || 'Выберите материальную ценность'}
                                    key={1}
                                    extra={
                                        <div onClick={(event) => {
                                            event.stopPropagation();
                                        }}>
                                            <Row style={{minWidth: '86px'}}>
                                                <Space>
                                                    <Input.Group compact>
                                                        <InputNumber style={{width: "55px"}} min={1}
                                                                     value={incomeDrawerSetting[indexSpecification].copyRecord}
                                                                     onChange={(value) => {
                                                                         incomeDrawerSetting[indexSpecification].copyRecord = Number(value);
                                                                         setIncomeDrawerSetting([...incomeDrawerSetting])
                                                                     }}/>
                                                        <Tooltip title="Копировать">
                                                            <Button type="primary" icon={<CopyOutlined/>}
                                                                    onClick={() => copyField(indexSpecification)}
                                                            />
                                                        </Tooltip>
                                                    </Input.Group>
                                                    {deletedRecord &&
                                                        <Tooltip title="Удалить">
                                                            <Button type="primary" danger icon={<DeleteOutlined/>}
                                                                    onClick={(event) => {
                                                                        Modal.confirm({
                                                                            centered: true,
                                                                            title: 'Вы точно хотите удалить запись?',
                                                                            okText: 'Да',
                                                                            okButtonProps: {danger: true},
                                                                            cancelText: 'Нет',
                                                                            onOk: () => {
                                                                                removeField(event, indexSpecification)
                                                                            }
                                                                        })
                                                                    }}
                                                            />
                                                        </Tooltip>}
                                                </Space>
                                            </Row>
                                        </div>
                                    }>
                                    <Row gutter={24}>
                                        {/*Оборудование из справочника*/}
                                        <Col span={12}>
                                            <MaterialValueSprSelect load={loadSelect} buttonAdd={true}
                                                                    name={indexSpecification + 'materialValue'}
                                                                    rulesOn={true} typeUrl={'allMaterialValue'}
                                                                    onChange={(value) => changeField(indexSpecification, "materialValue", value)}/>
                                        </Col>
                                        {/*Стоимость*/}
                                        <Col span={12}>
                                            <Form.Item
                                                label="Стоимость"
                                                name={indexSpecification + 'sum'}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Укажите стоимость'
                                                    }
                                                ]}
                                            >
                                                <InputNumber style={{minWidth: "100%"}} min={1}
                                                             onChange={(value) => changeField(indexSpecification, "sum", Number(value))}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        {/*Бюджетный счет*/}
                                        <Col span={24}>
                                            <BudgetAccountSelect load={loadSelect} buttonAdd={true}
                                                                 name={indexSpecification + 'budgetAccount'}
                                                                 rulesOn={true}
                                                                 onChange={(value) => changeField(indexSpecification, "budgetAccount", value)}/>
                                        </Col>
                                    </Row>
                                    {/*Состав*/}
                                    <Collapse>
                                        <Panel header={`В составе`} key={1}>
                                            <Layout className={"parentTable"} style={{maxHeight: "270px"}}>
                                                <ButtonGroup button={{
                                                    ...button[indexSpecification], buttonVoid: {
                                                        addRecord: () => {
                                                            setIncomeChildrenVisible(true);
                                                            x(indexSpecification, [{} as IncomeChildrenModel], true);
                                                        },
                                                        editRecord: () => {
                                                            setIncomeChildrenVisible(true)
                                                            x(indexSpecification, [{} as IncomeChildrenModel], true);
                                                        },
                                                        deleteRecord: () => {
                                                            let newArrDelete = [...values.spec];
                                                            newArrDelete[indexSpecification].children = incomeDeleteRecord(values.spec[indexSpecification].children!, incomeDrawerSelectRecord[indexSpecification]);
                                                            x(indexSpecification, [{} as IncomeChildrenModel], true);
                                                        }
                                                    }
                                                }}/>
                                                <TableCustom multiSelect={false} expandable={true}
                                                             dataSource={values.spec[indexSpecification].children!}
                                                             columns={incomeDrawer}
                                                             spinningLoading={false}
                                                             selectRecordIn={[incomeDrawerSelectRecord[indexSpecification]]}
                                                             returnDoubleClick={() => setIncomeChildrenVisible(true)}
                                                             returnSelectRecords={(selectRecordIn) => {
                                                                 x(indexSpecification, selectRecordIn[0], false);
                                                             }}
                                                />
                                            </Layout>
                                        </Panel>
                                    </Collapse>
                                </Panel>
                            </Collapse>
                        </div>
                    )
                })
                }
            </>
        )
    }

    const incomeChildrenSave = (value: IncomeChildrenModel[]) => {
        values.spec[indexSpecificationGlobal].children = incomeSaveRecord(values.spec[indexSpecificationGlobal].children!, value);
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
                    <Button onClick={() => onClickAddField()}>Добавить</Button>
                    <Button type="primary" onClick={() => onClickSaveRecord()}>Сохранить</Button>
                </Space>
            }
        >
            <Form form={formMain} layout="vertical" preserve={false}>
                <div style={{padding: '12px', background: "#F5F5F5", borderRadius: "0 0 10px 10px"}}>
                    <Row gutter={24}>
                        {/*Организация*/}
                        <Col span={12}>
                            <OrganizationTreeSelect load={true} buttonAdd={true}
                                                    name={'organization'}
                                                    rulesOn={false} organizationType={'organization'}
                                                    onChange={(value) => setValues({...values, organization: value!})}/>
                        </Col>
                        {/*Основание*/}
                        <Col span={12}>
                            <ReasonSelect load={true} buttonAdd={true} name={'contract'} reasonType={'contract'}
                                          rulesOn={false}
                                          onChange={(value) => setValues({...values, contract: value})}/>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        {/*Склад*/}
                        <Col span={12}>
                            <LocationTreeSelect load={true} buttonAdd={true}
                                                name={'location'} locationType={'storage'}
                                                rulesOn={true}
                                                onChange={(label) => {
                                                    if (label!.type !== 'Склад') {
                                                        setNotification({
                                                            type: "error",
                                                            message: "Ошибка",
                                                            description: "Необходимо выбрать склад"
                                                        })
                                                        formMain.resetFields(['location']);
                                                    } else {
                                                        setValues({...values, location: label!})
                                                    }
                                                }}/>
                        </Col>
                        {/*МОЛ*/}
                        <Col span={12}>
                            <UserSelect load={true} buttonAdd={true} label={"МОЛ"}
                                        name={'responsible'}
                                        rulesOn={false}
                                        onChange={(value) => setValues({...values, responsible: value})}/>
                        </Col>
                    </Row>
                    <Divider style={{margin: "0"}}>Номенклатура</Divider>
                </div>
            </Form>
            <Form form={formSpe} layout="vertical" preserve={false}>
                {viewAddField()}
            </Form>
            {incomeChildrenVisible &&
                <IncomeChildrenDrawer
                    parentTitle={getDeviceName(values.spec[indexSpecificationGlobal].materialValue)}
                    openDrawer={incomeChildrenVisible} value={incomeDrawerSelectRecord[indexSpecificationGlobal]}
                    closeDrawer={() => setIncomeChildrenVisible(!incomeChildrenVisible)}
                    saveRecord={(value) => incomeChildrenSave(value)}/>
            }
        </Drawer>
    );
};

export default IncomeDrawer;