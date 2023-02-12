export interface CounterpartyModel {
    id: string;
    name: string;
    inn: string;
    telephone: string;
    email: string;
    contact: string;
    deleted: boolean;
}

export interface CounterpartyDeleteModel {
    id: string;
}