import db from "../db.server";
import { getQRCodeImage } from "./QRCode.server";



export async function getFirstNProducts(N, graphql) {

    const response = await graphql(
        `
        query justAFunctionName($number: Int) {
            shop {
              name
            }
            products(first: $number) {
              nodes {
                id
                title
                description
                variants(first: 3) {
                  nodes {
                    title
                  }
                }
                priceRangeV2 {
                  minVariantPrice {
                    ...productPrice
                  }
                  maxVariantPrice {
                    ...productPrice
                  }
                }
              }
            }
          }
          
          fragment productPrice on MoneyV2 {
            currencyCode
            amount
          }
        `,
        {
            variables: {
                "number": N
            },
        }
    );

    const {
        data: { product },
    } = await response.json();

    return {
        productDeleted: !product?.title,
        productTitle: product?.title,
        productImage: product?.images?.nodes[0]?.url,
        productAlt: product?.images?.nodes[0]?.altText,
    };
}
