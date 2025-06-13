# smallslides Block

A horizontally scrollable, pill/oval-style carousel for city/image slides, as seen in the design screenshot.

## Usage

Add a block with the class `smallslides` and the following structure:

```
<div class="smallslides-wrapper">
  <div class="smallslides block" data-block-name="smallslides" data-block-status="loaded">
    <div>
      <div>
        <p><picture>...</picture></p>
        <p>City Name</p>
      </div>
    </div>
    ...
  </div>
</div>
```

- Each direct child `<div>` of `.smallslides.block` is a slide.
- Each slide contains an image (in a `<picture>` or `<img>`) and a city name.
- Navigation arrows are automatically added.
- The active slide is highlighted with a blue border.

## Features
- Horizontal scroll with snap
- Keyboard and mouse/touch navigation
- Responsive design
- Blue border for the active slide 