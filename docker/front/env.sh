#!/bin/sh

# Create config.js dynamically using a here-doc
cat > "/usr/share/nginx/html/config.js" <<EOF
var NAC_API_URL = "${NAC_FRONT_URL:-${NAC_API_URL:-}}";
var REDIRECT_LOGIN_URL = "${REDIRECT_LOGIN_URL:-}";
EOF

# Add config.js to index.html
sed -i '/<script type="module".*/a\
\t<script src="/config.js"></script>
' /usr/share/nginx/html/index.html
