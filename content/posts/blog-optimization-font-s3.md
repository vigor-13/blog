---
title: 블로그 최적화 - 폰트 리소스 S3로 이전하기
description: 블로그 작업 일지
tags: [font, aws, s3]
date: 2024-01-05
---

## 문제점

2024년 현재 블로그를 Netlify에서 호스팅하고 있다. 다만 무료 계정에서는 한국 CDN을 사용할 수 없기 때문에 폰트 리소스들을 S3로 이전 하기로 결정했다.

참고로 현재(2023년 기준) Netlify CDN 위치는 다음과 같다. ([참조](https://answers.netlify.com/t/is-there-a-list-of-where-netlifys-cdn-pops-are-located/855))

- **Regular CDN**:

  - Central Europe (Frankfurt, Germany)
  - South America (Sao Paulo, Brazil)
  - Eastern US (Virginia, USA)
  - Western US (San Francisco, USA)
  - Asia (Singapore, Republic of Singapore)
  - Oceania (Sydney, Australia)

- **High-Performance CDN**:
  - Middle East (Muharraq Island, Kingdom of Bahrain)
  - South Africa (Cape Town, South Africa)
  - Eastern US (Ohio, USA)
  - Eastern US (Virginia, USA)
  - Central US (Iowa, USA)
  - Central US (Dallas, TX)
  - Western US (San Francisco, USA)
  - Eastern Canada (Montreal, Canada)
  - South America (Sao Paulo, Brazil)
  - Europe (Amsterdam, Netherlands)
  - Europe (Dublin, Ireland)
  - Europe (Frankfurt, Germany)
  - Europe (Stockholm, Sweden)
  - Europe (London, United Kingdom)
  - Asia (Tokyo, Japan)
  - Asia (Singapore, Republic of Singapore)
  - Asia (Mumbai, India)
  - Asia (Incheon, South Korea)
  - Oceania (Sydney, Australia)

## 해결 방법

방법은 간단하다. 원하는 버킷에 폰트를 업로드하고 CSS에서 주소만 변경하면 된다.

다만 여기에 추가로 **CORS** 설정을 해줘야 한다.

![Font CORS 에러](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/blog-optimization-font-s3/1.png)

:::note 어떤 요청이 CORS를 사용할까? (MDN)
교차 출처 공유 표준은 다음과 같은 경우에 사이트간 HTTP 요청을 허용한다. ([참조](https://developer.mozilla.org/ko/docs/Web/HTTP/CORS#%EC%96%B4%EB%96%A4_%EC%9A%94%EC%B2%AD%EC%9D%B4_cors%EB%A5%BC_%EC%82%AC%EC%9A%A9%ED%95%98%EB%82%98%EC%9A%94))

- XMLHttpRequest와 Fetch API 호출.
- _웹 폰트(CSS 내 @font-face에서 교차 도메인 폰트 사용 시)._
- WebGL 텍스쳐.
- drawImage() (en-US)를 사용해 캔버스에 그린 이미지/비디오 프레임.
- 이미지로부터 추출하는 CSS Shapes. (en-US)
  :::

CORS 설정은 버킷 페이지의 **Permissions** 탭에서 할 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/blog-optimization-font-s3/2.png)

페이지 맨 아래에서 **Cross-origin resource sharing (CORS)** 항목을 찾을 수 있다.

![](https://s3.ap-northeast-2.amazonaws.com/vigorously.xyz/assets/images/blog-optimization-font-s3/3.png)

CORS 설정은 JSON 형식으로 작성해야 한다.

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET"],
    "AllowedOrigins": ["https://www.vigorously.xyz"],
    "ExposeHeaders": []
  },
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET"],
    "AllowedOrigins": ["http://localhost:8081"],
    "ExposeHeaders": []
  }
]
```
