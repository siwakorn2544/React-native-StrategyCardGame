# React native
React-Native-Strategy-Card-Game

### Orignal [react-native-Strategy-Card-Game](https://github.com/piyanatnine/react-native-Strategy-Card-Game)
> In this project I was it62070180


```bash
 npm install @react-native-firebase/storage
 npm install react-native-modal
 npm install --save react-native-vector-icons icon 
```
เจอปัญหา เพื่อ --force ก่อน install 
สำหรับIconที่ใช้ถ้าไม่แสดงให้พิม react-native link react-native-vector-icons ใน cmd เพื่อเชื่อมต่อกับ ไฟล์

เพื่ม ใน android/app/build.gradle ใน แท็บ dependencies
 implementation 'com.facebook.fresco:fresco:2.6.0' //gif
    // implementation 'com.facebook.fresco:animated-gif:2.0.0' //gif
    // For animated GIF support
    implementation 'com.facebook.fresco:animated-gif:2.6.0'

    // For WebP support, including animated WebP
    implementation 'com.facebook.fresco:animated-webp:2.6.0'
    implementation 'com.facebook.fresco:webpsupport:2.6.0'

    // For WebP support, without animations
    implementation 'com.facebook.fresco:webpsupport:2.6.0'

    // Provide the Android support library (you might already have this or a similar dependency)
    implementation 'com.android.support:support-core-utils:24.2.1'
