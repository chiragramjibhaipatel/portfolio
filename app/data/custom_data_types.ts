type Testimonial = {
  rating: number;
  text: string;
  profilePhoto: string;
};

//create type for tags

//create types for data
type Data = {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  logo: {url: string; altText: string};
  client: string;
  company: string;
  shop: string;
  status: string;
  testimonial: Testimonial;
  companyProfile: string;
  taskDetails: string;
  solution: string;
  hurdles: string;
  tools: string[];
};
