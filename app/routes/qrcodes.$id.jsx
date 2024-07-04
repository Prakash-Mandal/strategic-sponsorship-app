import { json } from "@remix-run/node";
import invariant from "invariant";
import { useLoaderData } from "@remix-run/react";

import db from "../db.server";
import { getQRCodeImage } from "../models/QRCode.server";
import { AppProvider, CalloutCard, MediaCard, Page } from "@shopify/polaris";

export const loader = async ({ params }) => {
  invariant(params.id, "Could not find QR code destination");

  const id = Number(params.id);
  const qrCode = await db.qRCode.findFirst({ where: { id } });

  invariant(qrCode, "Could not find QR code destination");

  return json({
    title: qrCode.title,
    image: await getQRCodeImage(id),
  });
};

export default function QRCode() {
  const { image, title } = useLoaderData();

  return (
    <Page>
      <img src={image}></img>
      <h1>{title}</h1>
    </Page>
  );

  return (

    <AppProvider
      i18n={{
        Polaris: {
          Common: {
            checkbox: 'case à cocher',
          },
          ResourceList: {
            sortingLabel: 'Trier par',
            showing: '{itemsCount} {resource} affichés',
            defaultItemPlural: 'articles',
            defaultItemSingular: 'article',
            Item: {
              viewItem: "Afficher les détails de l'{itemName}",
            },
          },
        },
      }}
    >
      <CalloutCard
        title={title}
        illustration={image}
      >
        <p>QR Code for the product, scan and see the magic</p>
        <img
          alt={`QR Code for product`}
          width="200"
          height="200"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          src={image}
        />
      </CalloutCard>

    </AppProvider>
  );
}
