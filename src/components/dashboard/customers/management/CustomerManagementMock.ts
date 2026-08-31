export interface CustomerItem {
  customerId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
  status: string;
}

export const MOCK_CUSTOMERS: CustomerItem[] = [
  {
    customerId: "PT001",
    firstName: "Saman",
    lastName: "Eliya",
    phone: "773409342",
    email: "saman@gmail.com",
    address: "Galle",
    createdAt: "08.9.2027",
    status: "cc",
  },
  {
    customerId: "PT002",
    firstName: "Kamal",
    lastName: "Nimara",
    phone: "779087321",
    email: "kamal@gmail.com",
    address: "Colombo",
    createdAt: "08.3.2027",
    status: "cc",
  },
  {
    customerId: "PT003",
    firstName: "Nimal",
    lastName: "Ekanayaka",
    phone: "778990878",
    email: "nimal@gmail.com",
    address: "Kaluthara",
    createdAt: "08.5.2027",
    status: "cc",
  },
  {
    customerId: "PT004",
    firstName: "Sunil",
    lastName: "Sanwasgala",
    phone: "712890081",
    email: "sunil@gmail.com",
    address: "Matara",
    createdAt: "03.7.2027",
    status: "cc",
  },
  {
    customerId: "PT005",
    firstName: "Anil",
    lastName: "Priyankara",
    phone: "772098762",
    email: "anil@gmail.com",
    address: "Colombo 2",
    createdAt: "05.9.2027",
    status: "cc",
  },
  {
    customerId: "PT006",
    firstName: "Amal",
    lastName: "Ripasinghe",
    phone: "758987632",
    email: "amal@gmail.com",
    address: "Colombo 3",
    createdAt: "08.9.2027",
    status: "cc",
  },
  {
    customerId: "PT007",
    firstName: "Kasun",
    lastName: "Dilsara",
    phone: "76540237",
    email: "kasun@gmail.com",
    address: "Dehiwala",
    createdAt: "09.9.2027",
    status: "cc",
  },
  {
    customerId: "PT008",
    firstName: "Imal",
    lastName: "Geesara",
    phone: "743871098",
    email: "abc@gmail.com",
    address: "Bambalapitiya",
    createdAt: "11.9.2027",
    status: "cc",
  },
  {
    customerId: "PT009",
    firstName: "Daya",
    lastName: "Wanigarathna",
    phone: "729840876",
    email: "daya@gmail.com",
    address: "Moratwa",
    createdAt: "17.9.2027",
    status: "cc",
  },
  {
    customerId: "PT010",
    firstName: "Dasun",
    lastName: "Chamara",
    phone: "713864328",
    email: "dasun@gmail.com",
    address: "Panadura",
    createdAt: "27.9.2027",
    status: "cc",
  },
];
