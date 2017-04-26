#https://medium.com/juan-cruz-viotti/how-to-code-sign-os-x-electron-apps-in-travis-ci-6b6a0756c04a

set -e

if [[ "$TRAVIS_OS_NAME" == "osx" ]]; then
  # decode the p12
  echo $CERTIFICATE_OSX_P12 | base64 --decode > certificate.p12

  # build a new keychain cause travis do not allow to add a new certificate
  security create-keychain -p keychainpassword build.keychain
  security default-keychain -s build.keychain
  security unlock-keychain -p keychainpassword build.keychain

  # import p12 to keychain
  security import certificate.p12 -k build.keychain -P $CERTIFICATE_PASSWORD -T /usr/bin/codesign

  # verify 
  security find-identity -v
fi