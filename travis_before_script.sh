set -e 

if [ ! -e apm/node_modules ]; then
  mkdir apm/node_modules 
  cd apm/node_modules
  git clone https://github.com/TheraPackages/apm.git atom-package-manager
  cd atom-package-manager && npm install
  cd ../../../
fi