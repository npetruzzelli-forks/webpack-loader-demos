Scenarios:
1.  `mini-css-extract-plugin` + `css-loader`
2.  `mini-css-extract-plugin` + `css-loader` + `postcss-loader`
3.  `mini-css-extract-plugin` + `css-loader` + `sass-loader`
4.  `mini-css-extract-plugin` + `css-loader` + `postcss-loader` + `sass-loader`

Notes:
-   `style-loader` will not be used because it seems to force the inclusion of content sources within the source map.
-   `style-loader/url` does not appear to be working when it is not used with the `file-loader`, more testing needed.
-   `mini-css-extract-plugin` is be used as it can accurately illustrate issues with `sources` in a source map when source content is not included.
