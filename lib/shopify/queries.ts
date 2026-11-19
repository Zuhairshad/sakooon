export const IMAGE = `fragment Img on Image { url altText width height }`;

export const PRODUCT = /* GraphQL */ `
  fragment ProductFields on Product {
    id handle title vendor productType tags description descriptionHtml createdAt availableForSale
    seo { title description }
    options { name optionValues { name swatch { color image { previewImage { url } } } } }
    featuredImage { ...Img }
    images(first: 30) { nodes { ...Img } }
    variants(first: 100) {
      nodes {
        id title availableForSale
        price { amount }
        compareAtPrice { amount }
        selectedOptions { name value }
        image { ...Img }
      }
    }
  }
  ${IMAGE}
`;

export const COLLECTION = /* GraphQL */ `
  fragment CollectionFields on Collection {
    id handle title description descriptionHtml
    seo { title description }
    image { ...Img }
  }
`;

export const CART = /* GraphQL */ `
  fragment CartFields on Cart {
    id checkoutUrl totalQuantity note
    cost { subtotalAmount { amount } totalAmount { amount } }
    lines(first: 100) {
      nodes {
        id quantity
        cost { totalAmount { amount } }
        merchandise {
          ... on ProductVariant {
            id title
            price { amount }
            compareAtPrice { amount }
            selectedOptions { name value }
            image { ...Img }
            product { handle title featuredImage { ...Img } }
          }
        }
      }
    }
  }
  ${IMAGE}
`;
