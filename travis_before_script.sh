set -e 

ls apm/node_modules

if [ ! -e apm/node_modules/atom-package-manager ]; then
  echo 'initializing apm'
  # mkdir apm/node_modules 
  cd apm/node_modules
  git clone https://github.com/TheraPackages/apm.git atom-package-manager
  cd atom-package-manager && npm install
  cd ../../../
else 
  echo 'skip apm install'
fi