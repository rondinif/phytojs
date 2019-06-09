#!/usr/bin/env sh

# remediation 1:  wrong esm path in umd/phyto.js
sed -i.backup 's/\.\.\/esm\//\.\.\/umd\//' ./umd/phyto.js