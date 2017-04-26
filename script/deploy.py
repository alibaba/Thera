# -*- coding: utf-8 -*-
from __future__ import print_function

import oss2, sys, glob, os

endpoint = 'http://cn-shanghai.oss.aliyun-inc.com'
destBaseUrl = 'http://skycloud-oss.cn-shanghai.oss.aliyun-inc.com/'

auth = oss2.Auth(os.environ['THERA_OSS_ACCESS_ID'], os.environ['THERA_OSS_ACCESS_KEY'])
bucket = oss2.Bucket(auth, endpoint, 'skycloud-oss')

# progress callback
def percentage(consumed_bytes, total_bytes):
    if total_bytes:
        rate = int(100 * (float(consumed_bytes) / float(total_bytes)))
        print('\r{0}% '.format(rate), end='')
        sys.stdout.flush()


# upload
for file in glob.glob('out/*.zip'):
    if file != 'out/thera-mac-symbols.zip':
        destPath = os.path.join('thera', 'ide', 'auto', os.path.basename(file))
        print('Uploading ' + file + ' to ' + destBaseUrl + destPath)
        bucket.put_object_from_file(destPath, file, progress_callback=percentage)
        print('Uploaded')