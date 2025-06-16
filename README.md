# chat-app-frontend

export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
source "$NVM_DIR/nvm.sh"
fi

docker buildx create --use
docker buildx build --platform linux/amd64 -t crawan/intimacy-client:amd64 --push .
