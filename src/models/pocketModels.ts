
export interface ISubPocket {
    firstName: string,
    lastName: string,
    phoneNumber: string,
    emailAddress: string,
    customerExternalRef?: string,
};

export class SubPocket {
    firstName: string;
    lastName:string;
    phoneNumber:string;
    emailAddress:string;
    customerExternalRef?:string;
}
