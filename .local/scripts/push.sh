git add .

if [ -z "$1" ]; then
  git commit -as
else
  git commit -asm "$1"
fi

git push origin "$(git rev-parse --abbrev-ref HEAD)"