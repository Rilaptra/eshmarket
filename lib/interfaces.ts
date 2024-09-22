export interface Product {
  _id: string;
  title: string;
  description: string;
  price: {
    money: number;
    dl: number;
  };
}

export interface User {
  _id: string;
  username: string;
  profileImage: string;
  role: string;
  isAdmin: boolean;
  balance: {
    dl: number;
    money: number;
  };
  scriptBuyed: Array<string>;
  chart: Array<Object>;
}
