#!/bin/sh
# Serial capture run: one browser at a time to stay within the reference site's rate limit.
cd "$(dirname "$0")/../.."
for job in "states collection 1440" "states product 1440" "states cart 1440" "states search 1440" \
           "states collection 390" "states product 390" "states cart 390" "states search 390" "states collection 768" \
           "pages collection" "pages product" "pages search"; do
  set -- $job
  echo "=== $job"
  node scripts/ref/commerce-$1.mjs $2 $3 2>&1 | grep -v '^ ' | tail -40
done
echo "=== ALL DONE"
