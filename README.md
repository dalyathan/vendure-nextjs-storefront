### VENDURE NEXTJS STOREFRONT ![Vector 902 (Stroke) (1)](https://github.com/user-attachments/assets/93e38773-7467-4374-a9e8-13387aa5b076)

This is a NextJS starter for Vendure in the form of a demo e-commerce shop. 

> [!TIP]
> The project is in its **alpha phase**! However, you can still read the concepts, run the storefront page locally, or check how it works at: [shop.aexol.com](https://shop.aexol.com).

<br />

## Table of Contents

- [Vendure NextJS Storefront](#vendure-nextjs-storefront)
  - [Table of Contents](#table-of-contents)
  -  [Installation](#Installation)
      - [Vendure Server](#vendure-server)
  - [Zeus](#Zeus)
  - [Page Naming Conventions](#page-Naming-Conventions)
  - [Internationalization With i18next](#internationalization-With-i18next)
  - [Appearance](#appearance)
    - [Icons](#Icons)
    - [Styles](#styles)
    - [Theme](#theme)
  - [More Info](#more-info)
    - [About Us](#About-Us)
    - [Useful Links](#Useful-Links)
    - [Roadmap](#Roadmap)

<br />

##  <span>🧰&nbsp;</span>Installation 

### 1. Clone this repo via SSH, HTTPS or the GitHub CLI.
### 2. Install the packages using: ```npm i```.
### 3. Set up your Vendure server locally and run it on `http://localhost:3000/`.

#### VENDURE SERVER
You need to have the Vendure store running locally to use this storefront. This storefront also requires a Vendure V2 server. You can either run a local instance, or you can access the demo of the Vendure server (MinIO & Postgres & SMTP) [HERE](https://github.com/aexol-studio/aexol-shop-backend).

<br />

❗ For the best experience when using our demo, you also need to apply certain modifications to the Vendure server:
- Apply two collections `all` and `search`. Both of them should contain all products (with the exception of cases using gift cards or shipping-protections)
- Add the stock level as a number value and not as enum values, as seen below:

```ts
export class ExactStockDisplayStrategy implements StockDisplayStrategy {
  getStockLevel(
    ctx: RequestContext,
    productVariant: ProductVariant,
    saleableStockLevel: number
  ): string {
    return saleableStockLevel.toString();
  }
}

export const catalogOptions: VendureConfig["catalogOptions"] = {
  stockDisplayStrategy: new ExactStockDisplayStrategy(),
};
```
   
### 4. Create a new `.env` file in the root of the project and add the following variables:
```env
NEXT_PUBLIC_HOST="http://localhost:3000/shop-api".
```
### 5. Run the project locally using ```npm run dev```.

<br />

## <span>⚡</span>Zeus

We use GraphQL Zeus to provide the Selectors for certain GraphQL queries. You can think of Selectors as fragments in GraphQL, just with extra type-safety.

<br />

## <span>💬</span>Page Naming Conventions


We aimed for a fairly simple naming convention for pages that aligns with the DDD (Domain-driven design) principles:


- Each page file is named using the format `page-name.page.tsx`, where `page-name` represents the name of the page or route. <br /> For example, the main page of your application would be named `index.page.tsx`.
- We are using slug pages for products and collections, where we have a `products` and `collections` folder with a `[slug].page.tsx`. The `[slug]` is replaced by the product or collection name fetched from the backend as props. <br /> This allows to dynamically generate those pages at scale, while maintaining a structure that is easy to navigate with routes such as `/collections/electronics/` or `/products/laptop/`.

<br />
  
Using such naming conventions helps maintain a clean and organized folder structure that reflects the structure of your application's domains or features. By separating pages into their respective folders and adopting a consistent naming convention, you can easily locate and manage your application's routes and comfortably navigate through any issues that might arise.

<br />

## <span>🌐</span>Internationalization With i18next

Because the majority of e-commerce shops uses localization to accomodate clients from all over the world, we have integrated i18next to handle language translations. i18next makes it convenient to add and update translated content. 

<br />

Hew we use i18next:
|Element|Description|
|:---|:---|
| **Translation Files** |  We maintain separate JSON translation files for each supported language. These files contain translation keys and their corresponding localized text. <br /> For example, you might find the English translation file for home page at `public/locales/en/homePage.json` |
| **Locale Configuration** | We configure i18next to load the appropriate translation files based on the user's selected locale. |
| **Integration with React** | We use the `next-i18next` package to integrate i18next with React components to seamlessly access the translations in your React components via a simple `useTranslation` hook. It will then always use the matching translation for the user's selected locale. |

Example:
```ts
import { useTranslation } from 'next-i18next';

export const Home: React.FC = () => {
    const { t } = useTranslation('homepage');

    return (
        <Layout>
                <Hero
                    cta={t('hero-cta')}
                    h1={t('hero-h1')}
                    h2={t('hero-h2')}
                    desc={t('hero-p')}
                    link="/collections/all"
                />
        </Layout>
    );
};
```

> [!TIP]
> For quick localization you can use [DevTranslate](https://devtranslate.app) to translate json files into up to 28 languages all at the same time.

<br />

## APPEARANCE

## <span>🎭</span>Icons

Lucide Icons is an open source library of over one thousand svg icons and symbols separated into official packages. This makes picking the icons you need for your project much easier.

❗ To check them out yourself head to: [lucide.dev](https://lucide.dev/).

<br />

## <span>🎨</span>Styles

We are building our own engine based on styled components with props that work similarly to our favorite CSS framework: [Tailwind](https://tailwindcss.com/). 

For example, here's what our `Stack` component looks like:

```tsx
export const Stack = styled.div<BaseFlexParams>`
    gap: ${p => p.gap || 0};
    display: flex;
    flex-direction: ${p => (p.column ? (p.reverse ? 'column-reverse' : 'column') : p.reverse ? 'row-reverse' : 'row')};
    flex-wrap: ${p => (p.flexWrap ? 'wrap' : 'nowrap')};
    justify-content: ${p =>
        p.justifyBetween ? 'space-between' : p.justifyCenter ? 'center' : p.justifyEnd ? 'end' : 'start'};
    align-items: ${p => (p.itemsCenter ? 'center' : 'initial')};
`;
```

<br />

Due to this set-up of props, the usage is very similar to Tailwind. The difference is that, in this case, you have to skip `ClassName`, as seen  below:

```tsx
<Stack column gap="2rem">
  {children}
</Stack>
```

<br />


## <span>🌆</span>Theme
Theming is provided by a set of generic functions in the code and [Emotion](https://emotion.sh/docs/introduction).

You can use values from the theme with `thv`. It is a function that consumes the theme and returns only the value.

You can alternatively use the usual method with `${p => p.theme}`. 

You can see both methods as seen in the example below:

```tsx
import { thv } from '@/src/theme';
import styled from '@emotion/styled';

export const IconButton = styled.button<{ isActive?: boolean }>`
    color: ${thv.button.icon.front};
    border: 0;
    border-radius: 100%;
    font-weight: 600;
    outline: 0;
    width: 2.4rem;
    height: 2.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${p => p.theme.button.icon.back || 'transparent'};
    svg {
        width: 2rem;
        height: 2rem;
    }
    :hover {
        box-shadow: none;
    }
`;

```

<br />

## MORE INFO

## <span>📝</span>About Us

We are the devs and contributors to the GraphQL ecosystem with a lot of experience. We want to enter Vendure to create developer-friendly e-commerce solutions that don't rely on clunky and outdated stuff like Shopify's Liquid wrapped with JavaScript.

<br />

## <span>🔗</span>Useful Links

- [Zeus Documentation](https://graphqleditor.com/docs/tools/zeus/basics/getting-started/)
- [i18next Documentation](https://www.i18next.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

<br />

## <span>🧮</span>Roadmap

- [ ] Finish the starter
- [X] Deploy the storefront connected to the demo shop
- [X] Implement basic cart functionality
- [X] Implement basic checkout process
- [ ] Implement the design
- [X] Add a basic payment process
- [X] Add a basic User Profile
- [X] Add the search products function
- [X] Add filters
- [ ] Provide localization with devtranslate.app
- [ ] Add Static Git CMS MDTX
- [ ] Configure SEO and schema.org for every site
- [ ] Assure ISR is ready on every sub-site
- [ ] Migrate to the next router
