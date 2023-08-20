# Using images from external URLs in AEM Franklin pages

## Introduction
This document explains a mechanism for getting images served from external URLs on AEM Franklin pages. You may find this useful if you want to have your images served from an external assets repository.

## Process
During the page authoring process, the author has to specify the external URL from which the image is served. This is done by having the image placed on the Word/Google Document and immediately followed by a external image marker hyperlink containing the publicly accessible image URL.

The *image marker* text must be a pre-configured value. You can configure it [here](https://github.com/hlxsites/franklin-assets-selector/blob/787672d9bab10063e0600196d2858bf6219a825b/scripts/assets.js#L34). By default, this implementation uses `//External Image//` as the marker. Here's [an example page and document](https://ext-images--franklin-assets-selector--hlxsites.hlx.page/external-images-example?view-doc-source=true)

## How does this work?
During the page rendering process, the frontend code changes the `src` attribute of the `img` tags on the page with the one specified via external image marker hyperlink. The author can specify query paramaters in the hyperlinked external url.
For e.g. in the above example, the author has specified the image format as `webp` and `quality=60`. Like

Additonally, while changing the `img` tag's `src` attribute, the original query parameters as present in the markup are appended to the hyperlinked external url. Do note that it entirely depends on the image delivery source on how to interpret(or ignore) these additional parameters.