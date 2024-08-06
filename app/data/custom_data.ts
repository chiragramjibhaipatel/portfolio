
export const clients: Clinet[] = [
  {
    id: "1",
    name: "Eugen",
    company: "Daensk",
    about: "Daensk is a leading online seller of heavy equipment goods. They deal in sand, wood pallets, etc",
  },
  {
    id: "3",
    name: "Dan Ward",
    company: "LocalCart",
    about: "",
  },
  ,
  {
    id: "2",
    name: "Cory Mosley",
    company: "Mosley Strategy Group LLC",
    about: "",
  },
];

export const data: Data[] = [
  {
    id: "1",
    title: "Dynamic Cart Pricings",
    description:
      "The merchant wants to remove the shipping rate provider app that he is already using, and use custom logic to set the price of the product on the product page and in the cart. The price is calculated based on the following criteria: original price, weight, location(warehouse), shipping rate, destination zip, sequence in the cart, total weight of the cart. ",
    start: "2021-09-01",
    end: "2021-09-02",
    shop: "https://daensk.de/",
    status: "active",
    testimonial: {
      rating: 5,
      text: `"Der gesamte Entwicklungsprozess verlief reibungslos und effizient. Von der ersten Kontaktaufnahme bis zur finalen Übergabe des Projekts war die Kommunikation stets klar und professionell.
Besonders beeindruckend war Chirag´s die Fähigkeit, unsere spezifischen Anforderungen und Wünsche zu verstehen und umzusetzen. Der Entwickler hat nicht nur unsere Erwartungen erfüllt, sondern sie in vielerlei Hinsicht übertroffen. Unser Shop sieht nicht nur großartig aus, sondern funktioniert auch einwandfrei und bietet ein hervorragendes Nutzererlebnis.
Die Expertise und das technische Know-how, die in das Projekt eingeflossen sind, haben unser Vertrauen in diesen Entwickler nur gestärkt. Jede Frage wurde prompt beantwortet und jede Herausforderung mit kreativen Lösungen gemeistert.
Vielen Dank für die ausgezeichnete Arbeit und den herausragenden Service! Wir freuen uns auf zukünftige Projekte und eine langfristige Zusammenarbeit."`,
      profilePhoto: "https://via.placeholder.com/150",
    },
    logo: {
      url: "",
      altText: "",
    },
    companyProfile: "",
    taskDetails: "",
    solution: "",
    hurdles: "",
    tools: [
      "React",
      "Node.js",
      "Shopify",
      "GraphQL",
      "REST API",
      "JavaScript",
      "TypeScript",
      "HTML",
      "CSS",
    ],
    client: clients[0],
  },
  {
    id: "2",
    title: "SLA Mediclinic - Lock Products",
    description:
      "The client has a Shopify store where they want to restrict specific products to be available to limited customers only. I have created an app that stores allowed skus to customer metafield, and keep track of all the orders placed. This task is automated via Order webhook. When any customer visits the store, the meta fields get read via liquid and only allow the customer to place the order if it is available.",
    start: "2021-09-03",
    end: "2021-09-04",
    shop: "https://localcart.com.au/",
    status: "closed",
    testimonial: {
      rating: 5,
      text: "This is an amazing product",
      profilePhoto: "https://via.placeholder.com/150",
    },
    logo: {
      url: "",
      altText: "",
    },
    companyProfile: "",
    taskDetails: "",
    solution: "",
    hurdles: "",
    tools: [
      "React",
      "Node.js",
      "Shopify",
      "GraphQL",
      "REST API",
      "JavaScript",
      "TypeScript",
      "HTML",
      "CSS",
    ],
    client: clients[1]
  },
  {
    id: "3",
    title: "GiveGet Shopify App",
    description:
      "I have created a Shopify app that allows customers to earn GiveGet rewards with their purchases. It allows merchants to configure GiveGet Addon on their store. The customers of these stores will be able to log in via auth0 and place the order. All such orders are then submitted to the GiveGet server where the customer's rewards are stored. This is a free unlisted Shopify App",
    start: "2021-09-05",
    end: "2021-09-06",
    shop: "",
    status: "closed",
    testimonial: {
      rating: 3,
      text: `We hired Chirag to build a Shopify plugin that we integrate into our business partner websites.
Throughout the project Chirag was extremely helpful, answered all of our queries very quickly and was always concerned about the quality of the product more than anything else.
I highly recommend Chirag for any Shopify related work as it was easy to see that he is extremely knowledgable about the inner workings of all Shopify systems and processes.
Thanks Chirag, it's been a pleasure working with you and I look forward to working with you again in the Future.
Cheers,
Ed`,
      profilePhoto: "https://via.placeholder.com/150",
    },
    logo: {
      url: "",
      altText: "",
    },
    companyProfile: "",
    taskDetails: "",
    solution: "",
    hurdles: "",
    tools: [
      "React",
      "Node.js",
      "Shopify",
      "GraphQL",
      "REST API",
      "JavaScript",
      "TypeScript",
      "HTML",
      "CSS",
    ],
    client: clients[2]
  },
  {
    id: "4",
    title: "3D Preview",
    description:
      "My task is to create a Shopify Public App that allows merchants to set text, color, placement, reflective and background images, fonts, and font tags. The images are stored in Shopify CDN. And the rest of the data is in the Shop Metafields. The merchant will be given some day trial(configurable) to test the app, and then the app will move to a paid plan. The Preview button will be injected into the product page of the store, and when clicked, the Customer will be able to preview the text as per the configuration in product tags. All the JS required are provided via CDN(JSDeliver-GitHub)",
    start: "2021-09-07",
    end: "2021-09-08",
    shop: "",
    status: "closed",
    testimonial: {
      rating: 2,
      text: "great developer!",
      profilePhoto: "https://via.placeholder.com",
    },
    logo: {
      url: "",
      altText: "",
    },
    companyProfile: "",
    taskDetails: "",
    solution: "",
    hurdles: "",
    tools: [
      "React",
      "Node.js",
      "Shopify",
      "GraphQL",
      "REST API",
      "JavaScript",
      "TypeScript",
      "HTML",
      "CSS",
    ],
    client: clients[2]
  },
];
