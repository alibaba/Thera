echo 'signing...'
codesign -s '3rd Party Mac Developer Application: Zhejiang Taobao Mall Technology Co,Ltd. (EAA28CVMQM)' --deep --force out/Thera.app --verbose 
codesign -vvv out/Thera.app