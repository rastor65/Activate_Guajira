
export interface tablaMaestra {
  id: number;
  nombre: string;
  codigo: string;
  categoria_id: number;
  createdAt: string;
  updateAt: string;
  status: boolean;
}

export interface categoriaTablaMaestra {
  id: number;
  nombre: string;
  createdAt: string;
  updateAt: string;
  status: boolean;
}

export interface Person {
  id: number | null;
  nombres?: string;
  apellidos?: string;
  identificacion?: string;
  departamento?: number | null
  fecha_nacimiento?: string;
  ciudad_residencia?: number | null;
  ciudad_nacimiento?: number | null;
  barrio?: number | null;
  situacion_laboral?: number | null;
  estrato?: number | null;
  telefono?: number;
  user?: number | null;
  document_type?: number | null;
  nivelFormacion?: number | null;
  estado_civil?: number | null;
  grupoEtnico?: number | null;
  edad?: number;
  genero?: number | null;
  status?: boolean;
  createdAt?: string;
  updateAt?: string;
}


export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  avatar: string;
}

export interface Person_request {
  ok: boolean;
  message: string;
  data: Person[];
  request_id: "";
}

export interface Usuario {
  id: number;
  email: string;
  username: string;
  password: string;
  avatar: string | null;
  roles: number[];
}

export interface Rol {
  id: number;
  createdAt: string;
  updateAt: string;
  name: string;
  status: boolean;
  users: number[];
  resources: number[];
}

export interface UserRole {
  id: number;
  status: boolean;
  userId: {
    id: number;
    last_login: string | null;
    is_superuser: boolean;
    username: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
    email: string;
    password: string;
    resetToken: string | null;
    avatar: string | null;
    groups: number[];
    user_permissions: number[];
    roles: number[];
  };
  rolesId: {
    id: number;
    createdAt: string;
    updateAt: string;
    name: string;
    status: boolean;
    users: number[];
    resources: number[];
  };
}