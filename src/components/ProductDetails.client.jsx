import {
  flattenConnection,
  useProduct,
  useParsedMetafields,
  ProductProvider,
  ProductTitle,
  ProductDescription,
  ProductPrice,
  AddToCartButton,
  BuyNowButton,
} from '@shopify/hydrogen/client';
import {useState} from 'react';
import {Wallet} from 'easy-spl';
import {PublicKey} from '@solana/web3.js';
import {useWallet, useConnection} from '@solana/wallet-adapter-react';

import ProductOptions from './ProductOptions.client';
import Gallery from './Gallery.client';
import {
  BUTTON_PRIMARY_CLASSES,
  BUTTON_SECONDARY_CLASSES,
} from './Button.client';
import CryptoCheckout from './CryptoCheckout.client';
import WalletWrapper from './WalletWrapper.client';

import environments from '../utils/environments';
import convertToCrypto from '../utils/convertToCryto';
import createOrder from '../utils/createOrder';

const {RECEIVER_ADDRESS, TOKEN_SYMBOL, NETWORK} = environments;

function AddToCartMarkup() {
  const [isOpen, setIsOpen] = useState(false);
  const {selectedVariant} = useProduct();
  const isOutOfStock = !selectedVariant.availableForSale;

  const {
    id,
    priceV2: {amount, currencyCode},
  } = selectedVariant;

  const {connection} = useConnection();
  const wallet = useWallet();
  const solanaWallet = new Wallet(connection, wallet);

  const cryptoAmount = convertToCrypto(
    Number(amount),
    currencyCode,
    TOKEN_SYMBOL,
  );

  const text = `Pay ${cryptoAmount} ${TOKEN_SYMBOL} for this product?`;
  const transfer = async (email) => {
    try {
      // use sol for the moment
      // change to our own token later
      const transactionSignature = await solanaWallet.transferSol(
        new PublicKey(RECEIVER_ADDRESS),
        cryptoAmount,
      );

      const data = {
        order: [{id, quantity: 1}],
        email,
        transactionSignature,
        chainId: NETWORK,
      };
      console.log({data});
      // await createOrder(data)

      // send this data to server to validate and create order

      // close modal
      setIsOpen(false);

      // reload page to re-get balance (for the moment)
      // window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-2 mb-8">
      <CryptoCheckout
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        text={text}
        transfer={transfer}
      />
      <button
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setIsOpen(true)}
      >
        Buy with crypto currency
      </button>
      <AddToCartButton
        className={BUTTON_PRIMARY_CLASSES}
        disabled={isOutOfStock}
      >
        {isOutOfStock ? 'Out of stock' : 'Add to bag'}
      </AddToCartButton>
      {isOutOfStock ? (
        <p className="text-black text-center">Available in 2-3 weeks</p>
      ) : (
        <BuyNowButton
          variantId={selectedVariant.id}
          className={BUTTON_SECONDARY_CLASSES}
        >
          Buy it now
        </BuyNowButton>
      )}
    </div>
  );
}

function SizeChart() {
  return (
    <>
      <h3
        className="text-xl text-black font-semibold mt-8 mb-4"
        id="size-chart"
      >
        Size Chart
      </h3>
      <table className="min-w-full table-fixed text-sm text-center bg-white">
        <thead>
          <tr className="bg-black text-white">
            <th className="w-1/4 py-2 px-4 font-normal">Board Size</th>
            <th className="w-1/4 py-2 px-4 font-normal">154</th>
            <th className="w-1/4 py-2 px-4 font-normal">158</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 border border-black">Weight Range</td>
            <td className="p-3 border border-black">120-180 lbs. /54-82kg</td>
            <td className="p-3 border border-black">150-200 lbs. /68-91 kg</td>
          </tr>
          <tr>
            <td className="p-3 border border-black">Waist Width</td>
            <td className="p-3 border border-black">246mm</td>
            <td className="p-3 border border-black">255mm</td>
          </tr>
          <tr>
            <td className="p-3 border border-black">Stance Width</td>
            <td className="p-3 border border-black">-40</td>
            <td className="p-3 border border-black">-40</td>
          </tr>
          <tr>
            <td className="p-3 border border-black">Binding Sizes</td>
            <td className="p-3 border border-black">
              Men&rsquo;s S/M, Women&rsquo;s S/M
            </td>
            <td className="p-3 border border-black">
              Men&rsquo;s L, Women&rsquo;s L
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function ProductPrices() {
  const product = useProduct();

  return (
    <>
      <ProductPrice
        className="text-gray-500 line-through text-lg font-semibold"
        priceType="compareAt"
        variantId={product.selectedVariant.id}
      />
      <ProductPrice
        className="text-gray-900 text-lg font-semibold"
        variantId={product.selectedVariant.id}
      />
    </>
  );
}

function ProductDetails({product}) {
  const initialVariant = flattenConnection(product.variants)[0];

  const productMetafields = useParsedMetafields(product.metafields);
  const sizeChartMetafield = productMetafields.find(
    (metafield) =>
      metafield.namespace === 'my_fields' && metafield.key === 'size_chart',
  );
  const sustainableMetafield = productMetafields.find(
    (metafield) =>
      metafield.namespace === 'my_fields' && metafield.key === 'sustainable',
  );
  const lifetimeWarrantyMetafield = productMetafields.find(
    (metafield) =>
      metafield.namespace === 'my_fields' &&
      metafield.key === 'lifetime_warranty',
  );

  return (
    <>
      <ProductProvider data={product} initialVariantId={initialVariant.id}>
        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-x-8 my-16">
          <div className="md:hidden mt-5 mb-8">
            <ProductTitle
              as="h1"
              className="text-4xl font-bold text-black mb-4"
            />
            {product.vendor && (
              <div className="text-sm font-medium mb-2 text-gray-900">
                {product.vendor}
              </div>
            )}
            <span />
            <div className="flex justify-between md:block">
              <ProductPrices />
            </div>
          </div>

          <Gallery />

          <div>
            <div className="hidden md:block">
              <ProductTitle
                as="h1"
                className="text-5xl font-bold text-black mb-4"
              />
              {product.vendor && (
                <div className="text-sm font-medium mb-2 text-gray-900">
                  {product.vendor}
                </div>
              )}
              <ProductPrices />
            </div>
            {/* Product Options */}
            <div className="mt-8">
              <ProductOptions />
              {sizeChartMetafield?.value && (
                <a
                  href="#size-chart"
                  className="block underline text-gray-500 text-sm tracking-wide my-4"
                >
                  Size Chart
                </a>
              )}
              <AddToCartMarkup />
              <div className="flex items space-x-4">
                {sustainableMetafield?.value && (
                  <span className="flex items-center mb-8">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current text-blue-600 mr-3"
                    >
                      <path
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364-.7071-.7071M6.34315 6.34315l-.70711-.70711m12.72796.00005-.7071.70711M6.3432 17.6569l-.70711.7071M16 12c0 2.2091-1.7909 4-4 4-2.20914 0-4-1.7909-4-4 0-2.20914 1.79086-4 4-4 2.2091 0 4 1.79086 4 4Z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-sm text-gray-900 font-medium">
                      Sustainable Material
                    </span>
                  </span>
                )}
                {lifetimeWarrantyMetafield?.value && (
                  <span className="flex items-center mb-8">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current text-blue-600 mr-3"
                    >
                      <path
                        d="M9 12L11 14L15 10M20.6179 5.98434C20.4132 5.99472 20.2072 5.99997 20 5.99997C16.9265 5.99997 14.123 4.84453 11.9999 2.94434C9.87691 4.84446 7.07339 5.99985 4 5.99985C3.79277 5.99985 3.58678 5.9946 3.38213 5.98422C3.1327 6.94783 3 7.95842 3 9.00001C3 14.5915 6.82432 19.2898 12 20.622C17.1757 19.2898 21 14.5915 21 9.00001C21 7.95847 20.8673 6.94791 20.6179 5.98434Z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-sm text-gray-900 font-medium">
                      Lifetime Warranty
                    </span>
                  </span>
                )}
              </div>
            </div>
            {/* Product Description */}
            <ProductDescription className="prose border-t border-gray-200 pt-6 text-black text-md" />
            {sizeChartMetafield?.value && (
              <div className="border-t border-gray-200">
                <SizeChart />
              </div>
            )}
          </div>
        </div>
      </ProductProvider>
    </>
  );
}

export default function ProductDetailWrapper(props) {
  return (
    <WalletWrapper>
      <ProductDetails {...props} />
    </WalletWrapper>
  );
}
