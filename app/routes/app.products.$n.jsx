import { BlockStack, Card, Icon, Text } from "@shopify/polaris";
import { getFirstNProducts } from "../models/products.server";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";


let productsPromise;

export async function loader({ request, params }) {
    
    const { admin } = await authenticate.admin(request);
  
    if (params.n === 0) {
      params.n = 3
    }
  
    productsPromise = (await getFirstNProducts(Number(params.n), admin.graphql));

    return productsPromise;
  }


export default async function ProductsPage({ request, params }) {
    const { admin } = await authenticate.admin(request);
  
    if (params.n === 0) {
      params.n = 3
    }

    productsPromise = (await getFirstNProducts(Number(params.n), admin.graphql));

    return Promise.all(
        productsPromise.map((product) => {
            <h1>{product}</h1>
        })
    );

    // return (
    //     <SpacingBackground>
    //         <InlineGrid gap="400" columns={3}>
    //             <Placeholder height="320px" />
    //         </InlineGrid>
    //     </SpacingBackground>
    // );
}

const SpacingBackground = ({ children, width = "100%" }) => {
    return (
        <div
            style={{
                background: "var(--p-color-bg-surface-success)",
                width,
                height: "auto"
            }}
        >
            {children}
        </div>
    )
}

const Placeholder = ({ height = 'auto', width = 'auto' }) => {
    return (
        <div
            style={{
                display: 'inherit',
                background: 'var(--p-color-text-info)',
                height: height ?? undefined,
                width: width ?? undefined,
            }}
        />
    );
};


function CardWithCustomReactNodeTitle(products) {
    return (
        <Card roundedAbove="sm">
            <BlockStack gap="200">
                <Text as="h2" variant="headingSm">
                    Products
                </Text>
                <BlockStack inlineAlign="start">
                    <InlineStack gap="400">
                        <Icon source={ProductIcon} />
                        <Text as="h3" variant="headingSm">
                            New Products
                        </Text>
                    </InlineStack>
                </BlockStack>
                <List>
                    <products className="map"></products>

                    <List.Item>Socks</List.Item>
                    <List.Item>Super Shoes</List.Item>
                </List>
            </BlockStack>
        </Card>
    );
}