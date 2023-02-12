export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface NotificationModel {
    type: NotificationType;
    message: string;
    description: string;
}

export interface ModalWaitModel {
    visible:boolean;
    message: string | null;
}