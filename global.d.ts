declare type Company = {
    id: number;
    name: string;
    email: string;
    logo: string;
    website: string;
    created_at: string;
    updated_at: string;
    employees_count: number;
};

declare type Employee = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company_id: number;
    created_at: string;
    updated_at: string;
    company: {
        id:number;
        name:string;
    };
};
