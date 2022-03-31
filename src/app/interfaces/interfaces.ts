export interface Billing {
    id: string;
    payment_method: string;
    total: number;
    user_id: string;
}

export interface Field {
    id: string;
    availability: string[];
    field_name: string;
    latitud: number;
    longitud: number;
    max_players: number;
    permit_url: string;
    status: string;
}

export interface Match{
    id: string;
    match_date: string;
    match_field: any;
    match_players: any[];
    status: string;
}

export interface UserHistory{
    id: string;
    match_id: string;
    user_id: string;
    score: number[];
}

export interface User{
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    owned_fields: string[];
    phone_number: string;
    picture_url: string;
    profile_type: string;
    status: string;
}