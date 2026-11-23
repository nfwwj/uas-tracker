
#relative to last workdir
set -e

cd /app/parser
uv run --no-sync uvicorn main:app --host 127.0.0.1 --port 8000 &

cd /app
npx prisma migrate deploy
exec node dist/main