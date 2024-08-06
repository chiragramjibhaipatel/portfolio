type Testimonial = {
  rating: number;
  text: string;
  profilePhoto: string;
};

type Clinet ={
  id: string;
  name?: string;
  company?: string;
  about?: string;
} | undefined;
//create type for tags

//create types for data
type Data = {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  logo: {url: string; altText: string};
  shop: string;
  status: string;
  testimonial: Testimonial;
  companyProfile: string;
  taskDetails: string;
  solution: string;
  hurdles: string;
  tools: string[];
  client?: Clinet;
};
