git add .

if [ "$1" -eq 0 ]; then
  git commit -as
else
  git commit -asm "$1"
fi

git push origin "$(git rev-parse --abbrev-ref HEAD)"