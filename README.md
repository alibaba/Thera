# Welcome to Thera [中文版](https://github.com/alibaba/Thera/wiki/readme-cn)

[![Build Status](https://travis-ci.org/alibaba/Thera.svg?branch=master)](https://travis-ci.org/alibaba/Thera)   

  

![](https://img.alicdn.com/tps/TB1meI7OVXXXXXcXXXXXXXXXXXX-1024-460.png)

Thera is a develop tool aiming to improve the developing experience of hybrid mobile app, which use weex, luaview, react native solition. It is built on top of Atom.  
Thera is founded by Alibaba, and managed by the open source community.  
We embrace open sources, hoping you join us.  
You can follow us on Twitter, fire a bug on github issues, vote for new features, and make pull requests.  

## Use Thera to develop hybrid apps
You can use Weex, React Native to develop hybrid apps, We choose Weex to introduce its features.

* **Project Navigator** (on the left): After created a project, you can navigate files in the navigation bar. Generally there are scripts, project description(.thera), test files and resources.
* **Editor** (in the middle): Thera supports both **hint**、**content assist**、**grammar** and **fast find**、**key location**
* **Property Panel** (on the right): Inspector dynamic view properties information on editing.
* **Console** (at the bottom): You can check console.log in **logcat** and thera status in **status**


Besides,
* **Performance** : Use **FPS**、**memory**、**load time** inspector to locate performance issue.
* **Team work** : Integrate with test tools and cloud service，**automatically test**、**data mock**、**code management** etc.

![Alt text](https://img.alicdn.com/tps/TB1XIklOVXXXXb_apXXXXXXXXXX-1903-1133.png)

----

## Quick-start guide
This guide introduces how to create a new project and run it on simulator or device.

### STEP 1 - create a new project:
follow the video below.

[![Little red ridning hood](https://gw.alicdn.com/tps/TB1PbIiOVXXXXblaFXXXXXXXXXX-1223-674.png)](https://vimeo.com/206175744 "Create a project - Click to Watch!")

* After install Thera, click **start a new Thera project for Weex** to create a Weex project
* Set the **project name**，Thera will create a main.we file as the entrance of the project.
* Set the **project location** where the project is located.

`Note: the project location should be able to access, otherwise creating will fail.   
You can check recent created projects in the project navigator, and remove them in folder.`

Several files will be created automatically after crating project, Thera recommend you using main.we as the project entrance file, using mock.json to mock local data, and build directory to save weex transforming result. You can modify the settings in the Thera project configuration file -- .thera/launch.json . Some files are used by Thera and cloud service, you can ignore them.

### STEP 2 - Edit:
Please follow the video
[![Little red ridning hood](https://img.alicdn.com/tps/TB1gzoyOVXXXXb4XVXXXXXXXXXX-1223-674.png)](https://vimeo.com/206176073 "Edit - Click to Watch!")

* Context-dependent code completion
* Code highlight of Weex & Vue
* Realtime hint when editing Weex based on linter

`Note: Use .we file extension or specify weex file format to enable features above.`

### STEP 3 - Run:
Please follow the video
[![Little red ridning hood](https://img.alicdn.com/tps/TB1qSMFOVXXXXbRXVXXXXXXXXXX-1223-674.jpg)](https://vimeo.com/206177328 "run time - Click to Watch!")

* Thera will detect local simulators. After click run button, Thera will start corresponding simulator and install **oreo preview** app for you to check result on real time.
* Thera will start a local delegate server (named Dumpling) in order to make connection between Thera and preview app. Dumpling use local port 7001 by default, you can change it in Thera configuration.
* When multiple device connected to Thera, you can choose one device(simulator or real device) at a time to check **variables, properties, performance**.

`Note: please make sure you have installed simulators. We recommend you check simulators on XCode/Genymotion first,  
and restart Thera if simulators cannot be recognized. Because starting Simulator at first time may fail.`

----


## Installing

#### macOS
Download the latest [Thera release](https://github.com/alibaba/Thera/releases)

#### Windows & Linux
The new skyscraper is still under construction.

## Building 
Building from source is still under construction, you can check out [thera packages](https://github.com/TheraPackages)

 
## Restrictions
* Vue 2.0 is not supported for now. 


## PMC Members & Committers
* Dean Wu(xiaoshu.wb at tmall.com)
* Deng Xu(dennis.dx at tmall.com)
* GUO Miaoyou(miaoyou.gmy at tmall.com)
* LIN Xueqiu(xueqiu.lxq at tmall.com)
* HU Chun(shiji.hc at tmall.com)


## License
[MIT](https://github.com/alibaba/Thera/blob/master/LICENSE.md)

## F&Q
[Portal](https://github.com/alibaba/Thera/wiki/F&Q)



