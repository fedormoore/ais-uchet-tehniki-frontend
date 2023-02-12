import React, {FC, useEffect, useState} from 'react';

import {Button, Col, Collapse, Drawer, Form, Input, InputNumber, Layout, Modal, Row, Space, Tooltip} from "antd";

import {useActions} from "../../../hooks/useActions";

import {CopyOutlined, DeleteOutlined} from "@ant-design/icons";
import {IncomeChildrenModel} from "../../../models/materialValueOrg/IncomeModel";
import MaterialValueSprSelect from "../../../components/ui/select/MaterialValueSprSelect";
import {incomeDeleteRecord, incomeSaveRecord} from "../../../dataPreparation/local/incomeLocal";
import {AppActionCreators} from "../../../reducers/app/appActionCreators";
import {getDeviceName} from "../../../components/storage";
import TableCustom from "../../../components/ui/table/TableCustom";
import {incomeDrawer} from "../../../components/ui/table/column/IncomeDrawer";
import ButtonGroup, {buttonInterface, initButton} from "../../../components/ui/ButtonGroup";

const {Panel} = Collapse;

interface IncomeChildrenDrawerProps {
    parentTitle: string;
    value?: IncomeChildrenModel;
    openDrawer: boolean;
    closeDrawer: () => void;
    saveRecord: (value: IncomeChildrenModel[]) => void;
}

interface IncomeDrawerSetting {
    copyRecord: number;
}

let indexSpecificationGlobal: number;

const IncomeChildrenDrawer: FC<IncomeChildrenDrawerProps> = (props) => {

    const [form] = Form.useForm();

    const {setNotification} = useActions(AppActionCreators);

    const [values, setValues] = useState<IncomeChildrenModel[]>([props.value!]);
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

    useEffect(() => {
        let buttonAddDisable: boolean = values[0].materialValue !== undefined ? !values[0].materialValue.materialValueType.addOther : true
        button[0].buttonDisable.addRecord = buttonAddDisable;
        setButton([...button])

        form.setFieldsValue(
            {
                '0materialValue': values[0].materialValue?.id,
                '0sum': values[0].sum,
                '0children': values[0].children
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onClickSaveRecord = (value: IncomeChildrenModel[]) => {
        form.validateFields()
            .then(() => {
                props.saveRecord(values);
                props.closeDrawer();
            })
            .catch(() => {
                setNotification({
                    type: "error",
                    message: "Ошибка",
                    description: "Не все обязательные поля заполнены"
                })
            })
    }

    const incomeChildrenSave = (value: IncomeChildrenModel[]) => {
        values[indexSpecificationGlobal].children = incomeSaveRecord(values[indexSpecificationGlobal].children!, value);
    }

    const onClickAddField = () => {
        values.push({} as IncomeChildrenModel);
        setValues([...values])

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
            values[index] = {...values[index], [name]: value};
            setValues([...values])
        }

        const removeField = (event: any, index: number) => {
            event.stopPropagation()
            values.splice(index, 1);

            refreshField(values);

            incomeDrawerSetting.splice(index, 1);
            setIncomeDrawerSetting([...incomeDrawerSetting])

            button.splice(index, 1);
            setButton([...button])

            incomeDrawerSelectRecord.splice(index, 1);
            setIncomeDrawerSelectRecord([...incomeDrawerSelectRecord])
        }

        const copyField = (index: number) => {
            form.validateFields()
                .then(() => {
                    let newArrValue = [...values];
                    for (let i = 0; i < incomeDrawerSetting[index].copyRecord; i++) {
                        newArrValue = newArrValue.concat(values[index]);

                        incomeDrawerSetting.push({copyRecord: 1})
                        setIncomeDrawerSetting(incomeDrawerSetting)
                        button.push(initButton)
                        incomeDrawerSelectRecord.push({} as IncomeChildrenModel)
                    }

                    setValues(newArrValue);
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

        const refreshField = (newArr: IncomeChildrenModel[]) => {
            for (let i = 0; i < newArr.length; i++) {
                form.setFieldsValue(
                    {
                        [i + 'materialValue']: newArr[i].materialValue?.id,
                        [i + 'sum']: newArr[i].sum,
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
                {values.map((item, indexSpecification) => {
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
                                    header={props.parentTitle + ' -> ' + getDeviceName(values[indexSpecification].materialValue)}
                                    key={1}
                                    extra={
                                        <div onClick={(event) => {
                                            event.stopPropagation();
                                        }}>
                                            <Row style={{minWidth: '126px'}}>
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
                                                                    rulesOn={true}
                                                                    typeUrl={'allMaterialValueByAddToOtherTrue'}
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
                                                            let newArrDelete = [...values];
                                                            newArrDelete[indexSpecification].children = incomeDeleteRecord(values[indexSpecification].children!, incomeDrawerSelectRecord[indexSpecification]);
                                                            x(indexSpecification, [{} as IncomeChildrenModel], true);
                                                        }
                                                    }
                                                }}/>
                                                <TableCustom multiSelect={false} expandable={true}
                                                             dataSource={values[indexSpecification].children!}
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
                    <Button type="primary" onClick={() => onClickSaveRecord(values)}>Сохранить</Button>
                </Space>
            }
        >
            <Form form={form} layout="vertical" preserve={false}>
                {viewAddField()}
            </Form>

            {incomeChildrenVisible &&
                <IncomeChildrenDrawer
                    parentTitle={props.parentTitle + ' -> ' + getDeviceName(values[indexSpecificationGlobal].materialValue)}
                    openDrawer={incomeChildrenVisible} value={incomeDrawerSelectRecord[indexSpecificationGlobal]}
                    closeDrawer={() => setIncomeChildrenVisible(!incomeChildrenVisible)}
                    saveRecord={(value) => incomeChildrenSave(value)}/>}
        </Drawer>
    );
};

export default IncomeChildrenDrawer;