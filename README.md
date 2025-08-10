
# E-commerce Micro Frontend Case Study

Bu proje, SOLID prensipleri ve 12 Faktör Uygulaması esas alınarak, Kayra Export için hazırlanmış, mikro frontend mimarisi ile geliştirilmiş bir e-ticaret frontend uygulama demosudur.

## Proje Yapısı

ecommerce-mf-case-study/  
│  
├── host-app/ --> Next.js tabanlı ana uygulama   
├── products-remote/ --> Ürün listesini gösteren Next.js tabanlı remote uygulaması  
├── basket-remote/ --> Sepeti yöneten React tabanlı remote uygulama  


## Kullanılan Teknolojiler

- Next.js
- React
- Ant Design
- Zustand
- React Query
- Webpack 5 Module Federation
- Fake Store API (https://fakestoreapi.com/)
- Docker

https://react.dev/learn/creating-a-react-app#full-stack-frameworks linkinde şu bilgiler yer almaktadır:
"If you want to build a new app or website with React, we recommend starting with a framework.
These recommended frameworks support all the features you need to deploy and scale your app in production.
They have integrated the latest React features and take advantage of React’s architecture.
Next.js’s App Router is a React framework that takes full advantage of React’s architecture to enable full-stack React apps"

Yani React uygulamalarını Next.js frameworkü ile geliştirmek, React'in tavsiye ettiği bir yöntemdir.

Next.js App Router ile zaten halihazırda server actions, fetch kullanımı, cache ve revalidate gibi modern ve güçlü bir veri çekme mimarisi sunmaktadır. 
Yani veri fetch() ile sunucuda getirilir, SEO dostudur, hızlı ilk yükleme sağlar.
React 18 ile birlikte gelen (Suspense ve streaming gibi) bazı yeni özellikler kullanılır.
Fakat RTK Query, bu yapılarla entegre değildir.

Redux’un karmaşık yapısını sadeleştirmek için Redux Toolkit geliştirilmiştir. RTK Query ise Redux Toolkit üzerine inşa edilmiştir.
Yani RTK Query ile React Query  aynı yapıya sahip değildir. Bu nedenle React Query, RTK Query nin desteklemediği bazı özellikleri desteklemektedir.

State Management olarak Redux ve Zustand i karşılaştıracak olursak; 
Redux Toolkitte Zustande kıyasla daha fazla gereksiz karmaşıklığa sebep olan boilerplate olarak adlandırdığımız kod yapıları vardır. 
Zustand'in bundle size ı daha küçük.

Bu nedenlerle projede Zustand ve React Query tercih ettim.

Microfrontend mimarisi için Module Federation normalde bu paketle yapılır: https://www.npmjs.com/package/@module-federation/nextjs-mf
Fakat bu linkten görüleceği üzere https://github.com/module-federation/core/issues/3153
module-federation paketi next js için artık destek vermemekte ve hatta aralarında bir husumet olmalı ki şu ifadeyi kullanmaktadır:
"If you are exploring microfrontends, do not use Next.js! It is a hostile framework and Vercel is an adversary of federation"

Bu nedenle microfrontend mimarisi için Turborepo + Monorepo tercih ettim:
https://vercel.com/docs/monorepos
https://turborepo.com/ 

Uygulamalar şu şekilde ayrı ayrı build edilip çalıştırılabilir:
ecommerce-mf-case-study\apps\basket-remote
npm run dev 
ecommerce-mf-case-study\apps\host-app
npm run dev
ecommerce-mf-case-study\apps\products-remote
npm run dev

Ayrıca ana dizinde ecommerce-mf-case-study\ tek komut ile 3 ü birden de çalıştırılabilir:
npx turbo run dev --parallel

responsive tasarım için bu şekilde açıklama ekledim:
// Ant Design'ın grid sistemi 24 sütunludur. Yani:
// xs={24} → Mobil cihazlarda (ekran < 576px) ürün tüm satırı kaplar (1 ürün/satır).
// sm={12} → Küçük ekranlarda (≥576px) 12 sütun kaplar → 2 ürün/satır.
// md={8} → Orta ekranlarda (≥768px) 8 sütun kaplar → 3 ürün/satır.
// lg={6} → Büyük ekranlarda (≥992px) 6 sütun kaplar → 4 ürün/satır.
// xl={6} → Daha büyük ekranlarda (≥1200px) yine 4 ürün/satır.
// xxl={6} → Ekstra büyük ekranlarda (≥1600px) 4 sütun kaplar → 6 ürün/satır.	

Ayrıca responsive tasarım için üstteki nav bar menü mobil ekranlarda hamburger menüye dönüşmektedir.