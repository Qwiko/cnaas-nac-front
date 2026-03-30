#!/bin/sh

REQUIRED_VARS="CNAAS_API_URL \
REDIRECT_LOGIN_URL"

for v in $REQUIRED_VARS; do
    if [ -z "$(printenv "$v")" ]; then
        echo "ERROR: Required environment variable $v is not set." >&2
        exit 1
    fi
done

# Create config.js dynamically using a here-doc
cat > "/usr/share/nginx/html/config.js" <<EOF
var API_URL = "${CNAAS_FRONT_URL:-${API_URL:-}}";
var REDIRECT_LOGIN_URL = "${REDIRECT_LOGIN_URL:-}";
EOF

# Add config.js to index.html
sed -i '/<script type="module".*/a\
\t<script src="/config.js"></script>
' /usr/share/nginx/html/index.html
