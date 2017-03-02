
Pod::Spec.new do |s|
  s.platform = :ios
  s.ios.deployment_target = '7.0'
  s.name = 'ALiWLog'
  s.version  = "1.6.1.17-SNAPSHOT"
  s.summary = '淘宝ALiWLog'
  s.description = 'ALiWLog SDK for IOS'
  s.homepage = 'http://gitlab.alibaba-inc.com/laiqiang.zlq/ALiWLog'
  s.license = {
    :type => 'Copyright',
    :text => <<-LICENSE
              Alibaba-Inc copyright
    LICENSE
  }
  s.requires_arc = true
  s.authors = {'亿刀'=>'laiqiang.zlq@taobao.com'}

  s.frameworks = 'UIKit', 'Foundation'

  s.source = { :git=>"git@gitlab.alibaba-inc.com:laiqiang.zlq/ALiWLog.git", :commit=> "d81fd09" }

  #s.exclude_files = exclude_files+networksdk_no_arc_files
  s.source_files = 'ALiWLog/*/*.{h,m,c,mm}'

end
