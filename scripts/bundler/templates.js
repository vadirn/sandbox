exports.html = ({
  assetsPath = '/assets',
  assets = {},
} = {}) => `<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  
  <!-- Primary Meta Tags -->
  <title>Title</title>
  <meta name="title">
  <meta name="description">

  <!-- Open Graph / Facebook -->
  <meta property="og:type">
  <meta property="og:url">
  <meta property="og:title">
  <meta property="og:description">
  <meta property="og:image">

  <!-- Twitter -->
  <meta property="twitter:card">
  <meta property="twitter:url">
  <meta property="twitter:title">
  <meta property="twitter:description">
  <meta property="twitter:image">
  
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  <link rel="icon" href="/favicon.ico">
  <link rel="icon" href="${assetsPath}/favicon.svg" sizes="any" type="image/svg+xml">
  <link rel="stylesheet" href="${assetsPath}/${assets['main.css']}">
</head>

<body>
  <script src='${assetsPath}/${assets['system.js']}'></script>
  <script>System.import('${assetsPath}/${assets['main.js']}');</script>
</body>

</html>`;

exports.now = () => `
{
  "version": 2,
  "routes": [
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
`;
