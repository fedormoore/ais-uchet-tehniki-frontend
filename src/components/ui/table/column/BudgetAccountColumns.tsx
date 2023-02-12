import {ColumnsType} from "antd/es/table";
import {BudgetAccountModel} from "../../../../models/spr/BudgetAccountModel";

export const budgetAccountColumns: ColumnsType<BudgetAccountModel> = [
    {
        title: 'Код',
        dataIndex: ['code'],
        key: 'code',
        width: '170px',
    },
    {
        title: 'Наименование',
        dataIndex: ['name'],
        key: 'name',
        width: '150px',
    }
];