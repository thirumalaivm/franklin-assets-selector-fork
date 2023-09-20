# Using images from external URLs in AEM Franklin pages

## Introduction
This document explains a mechanism for getting images served from external URLs on AEM Franklin pages. You may find this useful if you want to have your images served from an external assets repository.

## Process
During the page authoring process, the author has to specify the external URL from which the image is served. This is done by placing external image markers containing the hyperlinked publicly accessible image URLs on the Word/Google Document. The image markers are then replaced with the actual images during the page rendering process.

### Note for site developers
The *image marker* text must be a pre-configured value. You can configure it [here](https://github.com/hlxsites/franklin-assets-selector/blob/b97d5617197780777ce14d1d5a0acf191a61b50a/scripts/scripts.js#L138). By default, this implementation uses `//External Image//` as the marker.

Also note that for creating optimized `picture` tags for external images, you must override `createOptimizedPicture` function. You can find the overidden implementation of `createOptimizedPicture` [here](https://github.com/hlxsites/franklin-assets-selector/blob/b97d5617197780777ce14d1d5a0acf191a61b50a/scripts/scripts.js#L88-L128) and here's a [usage example](https://github.com/hlxsites/franklin-assets-selector/blob/b97d5617197780777ce14d1d5a0acf191a61b50a/blocks/cards/cards.js#L15).


### Note for site authors
Here's [an example page and document](https://ext-images--franklin-assets-selector--hlxsites.hlx.page/external-images-example?view-doc-source=true) that shows how to use external images in AEM Franklin pages.

## How does this work?
During the page rendering process, the frontend code replaces the external image markers on the page with the `picture` tags with `src`/`srcset` attributes set as the external image's url as specified in the external image marker placed on the Word / Google Document during the page authoring process.

Authors can optionally specify query paramaters in the hyperlinked external url and they would be retained in the `picture` tag's `src`/`srcset` attributes. These are useful for specifying image delivery parameters such as image width, height, format, etc. as understood by the external image delivery service.
