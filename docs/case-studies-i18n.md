# Case studies — kétnyelvű tartalom

Az esettanulmányok szövege a `src/data/case-studies.ts` fájlban van: minden bejegyzéshez kötelező `titleEn` / `titleHu`, `excerptEn` / `excerptHu`, `contentEn` / `contentHu`. A `localizeCaseStudy()` a route nyelvének megfelelő változatot adja vissza; az URL és a `slug` nyelvfüggetlen marad.
