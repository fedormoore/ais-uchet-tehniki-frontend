import React from "react";
import {UserModel} from "../../../../models/spr/UserModel";
import {ColumnsType} from "antd/es/table";
import {MaterialValueOrgModel} from "../../../../models/MaterialValueOrgModel";
import {getDeviceName} from "../../../storage";

export type InterfaceType = 'storage' | 'cabinet' | 'any';

interface MaterialValueOrgProps {
    interfaceType: InterfaceType;
}

export const materialValueOrgColumns = (valueProps: MaterialValueOrgProps) => {

    const x = () => {
        let columnsTmp: ColumnsType<MaterialValueOrgModel> = [];
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].key === 'location') {
                columns[i].title = valueProps.interfaceType === 'storage' ? 'Склад' : valueProps.interfaceType === 'cabinet' ? 'Кабинет' : valueProps.interfaceType === 'any' ? 'Расположение' : 'ошибка'
            }
            columnsTmp.push(columns[i])
        }
        if (valueProps.interfaceType === 'storage') {
            columnsTmp = columnsTmp.filter(item => item.key !== 'user')
        }
        return columnsTmp;
    }

    return x();
}

const columns: ColumnsType<MaterialValueOrgModel> = [
    {
        title: 'Наименование МЦ',
        key: 'model',
        width: '400px',
        fixed: 'left',
        render: (record: MaterialValueOrgModel) => {
            return <>{getDeviceName(record.materialValue)}</>
        },
    },
    {
        title: 'Штрихкод',
        dataIndex: ['barcode'],
        key: 'barcode',
        width: '100px',
    },
    {
        title: 'Статус',
        dataIndex: ['status'],
        key: 'status',
        width: '170px'
    },
    {
        title: 'Организация',
        dataIndex: ['organization', 'name'],
        key: 'organization',
        width: '170px'
    },
    {
        dataIndex: ['location', 'name'],
        key: 'location',
        width: '200px',
    },
    {
        title: 'Бюджетный счет',
        dataIndex: ['budgetAccount', 'name'],
        key: 'budgetAccount',
        width: '170px',
    },
    {
        title: 'МОЛ',
        dataIndex: ['responsible'],
        key: 'responsible',
        width: '200px',
        render: (responsible: UserModel) => responsible !== null && responsible !== undefined ? <><>{responsible.lastName + " " || ""}</>
            <>{responsible.firstName + " " || ""}</>
            <>{responsible.middleNames || ""}</>
        </> : ''
    },
    {
        title: 'Инвентарный номер',
        dataIndex: 'invNumber',
        key: 'invNumber',
        width: '170px',
    },
    {
        title: 'За пользователем',
        dataIndex: ['user'],
        key: 'user',
        width: '200px',
        render: (user: UserModel) => user !== null && user !== undefined ? <><>{user.lastName + " " || ""}</>
            <>{user.firstName + " " || ""}</>
            <>{user.middleNames || ""}</>
        </> : ''
    }
];