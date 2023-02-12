import {ColumnsType} from "antd/es/table";
import {MaterialValueModel} from "../../../../models/spr/MaterialValueModel";
import {getDeviceName} from "../../../storage";

export const incomeDrawer: ColumnsType<MaterialValueModel> = [
    {
        title: 'Наименование МЦ',
        dataIndex: 'materialValue',
        key: 'materialValue',
        width: '330px',
        fixed: true,
        render: (record: MaterialValueModel) => <>{getDeviceName(record)} </>,
    },
    {
        title: 'Стоимость',
        dataIndex: 'sum',
        key: 'sum',
        width: '85px',
    }
];