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
  logo?: string;
  tags: string[];
  client: string;
  shop: string;
  status: string;
  testimonial: Testimonial;
};
