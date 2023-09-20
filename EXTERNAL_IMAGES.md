# Using images from external URLs in AEM Franklin pages

## Introduction
This document explains a mechanism for getting images served from external URLs on AEM Franklin pages. You may find this useful if you want to have your images served from an external assets repository.

## Process
During the page authoring process, the author has to specify the external URL from which the image is served. This is done by placing external image markers containing the hyperlinked publicly accessible image URLs on the Word/Google Document. The image markers are then replaced with the actual images during the page rendering process.

### Note for site authors
Here's [an example page and document](https://ext-images--franklin-assets-selector--hlxsites.hlx.page/external-images-example?view-doc-source=true) that shows how to use external images in AEM Franklin pages.

### Note for site developers
The *image marker* text must be a pre-configured value. You can configure it [here](https://github.com/hlxsites/franklin-assets-selector/blob/7346741927ec819ff5f06c88eae5c2bf61dff1b7/scripts/scripts.js#L148). By default, this implementation uses `//External Image//` as the marker.

Also note that for creating optimized `picture` tags for external images, you must override `createOptimizedPicture` function. You can find a sample overidden implementation of `createOptimizedPicture` [here](https://github.com/hlxsites/franklin-assets-selector/blob/7346741927ec819ff5f06c88eae5c2bf61dff1b7/scripts/scripts.js#L88-L138).

To summarize, most of the logic for this [is here](https://github.com/hlxsites/franklin-assets-selector/blob/7346741927ec819ff5f06c88eae5c2bf61dff1b7/scripts/scripts.js#L69-L175) and trigger point for it starts with `decorateExternalImages` [here](https://github.com/hlxsites/franklin-assets-selector/blob/7346741927ec819ff5f06c88eae5c2bf61dff1b7/scripts/scripts.js#L183).

## How does this work?
During the page rendering process, the frontend code replaces the external image markers on the page with the `picture` tags with `src`/`srcset` attributes set as the external image's url as specified in the external image marker placed on the Word / Google Document during the page authoring process.

Authors can optionally specify query paramaters in the hyperlinked external url and they would be retained in the `picture` tag's `src`/`srcset` attributes. These are useful for specifying image delivery parameters such as image width, height, format, etc. as understood by the external image delivery service.
