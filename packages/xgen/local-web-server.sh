# local web server test for built app
# .umirc.ts: import {} './build/config' => import {} './build/lws'
# then pnpm run build

cd dist
ws --spa index.html \
   --rewrite '/api/(.*) -> http://localhost:5099/api/$1' \
   --rewrite '/extend/(.*) -> http://localhost:5099/extend/$1' \
   --rewrite '/assets/(.*) -> http://localhost:5099/assets/$1' \
   --rewrite '/iframe/(.*) -> http://localhost:5099/iframe/$1' 
