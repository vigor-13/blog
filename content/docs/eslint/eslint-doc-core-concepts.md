---
title: 핵심 컨셉
description: 이 페이지에서는 ESLint의 핵심 개념 중 일부에 대한 개요를 설명한다.
date: 2024-05-10
tags: []
references:
  [
    {
      key: 'ESLint 공식 문서',
      value: 'https://eslint.org/docs/latest/use/core-concepts/',
    },
  ]
---

## ESLint란? {#what-is-eslint}

ESLint는 사용자가 원하는 대로 커스터마이징할 수 있는 JavaScript 린터다. 이 도구는 JavaScript 코드에 존재할 수 있는 다양한 문제를 식별하고 해결하는 데 도움을 준다. 여기서 문제란 잠재적인 런타임 버그, 모범 사례 미준수, 코딩 스타일 위반 등 광범위한 사항을 포함한다.

## 규칙(Rules) {#rules}

규칙(Rules)은 ESLint의 가장 기본적인 요소로, 코드가 특정한 기준을 만족하는지 검사하고 기준에 부합하지 않을 경우 취해야 할 동작을 정의한다. 각 규칙은 해당 규칙만의 추가 설정 옵션을 가질 수 있다.

한 가지 예로, `semi` 규칙은 JavaScript 문장의 끝에 세미콜론( `;` )을 필수로 붙일 것인지, 아니면 붙이지 않을 것인지를 명시한다. 이 규칙은 문장 끝에 항상 세미콜론을 요구하도록 설정할 수도 있고, 반대로 세미콜론을 금지하도록 설정할 수도 있다.

ESLint는 기본적으로 수백 개의 내장 규칙을 제공하므로, 바로 사용할 수 있다. 뿐만 아니라 개발자가 직접 새로운 규칙을 만들거나, 플러그인을 통해 다른 사람이 작성한 규칙을 가져와 사용할 수도 있다.

:::note
자세한 내용은 [문서](https://eslint.org/docs/latest/rules/)를 참조한다.
:::

### 규칙 수정 {#rule-fixes}

ESLint의 규칙은 단순히 문제를 찾아내는 것뿐만 아니라, 발견된 위반 사항을 자동으로 수정하는 기능도 제공할 수 있다. 

이러한 수정 기능은 코드의 동작을 변경하지 않으면서 문제를 안전하게 해결할 수 있도록 설계되었다. 

1. **자동 수정의 원리**
   - 일부 ESLint 규칙은 위반 사항에 대한 자동 수정 로직을 내장하고 있다.
   - 수정 로직은 문제가 되는 코드를 분석하여 올바른 형태로 변경하는 방법을 정의한다.
   - 예를 들어, `semi` 규칙은 세미콜론이 누락된 문장 끝에 세미콜론을 추가하는 수정 로직을 가질 수 있다.
2. **수정의 안전성 보장**
   - ESLint의 수정 기능은 코드의 동작을 변경하지 않도록 주의 깊게 설계되었다.
   - 수정 로직은 문제가 되는 부분만 정확히 타겟팅하여 수정하며, 다른 부분에는 영향을 주지 않는다.
   - 이를 통해 개발자는 수정 기능을 안심하고 사용할 수 있다.
3. **명령줄에서의 수정 적용**
   - ESLint는 명령줄 인터페이스(CLI)에서 `--fix` 옵션을 제공한다.
   - `eslint --fix` 명령을 실행하면 ESLint는 코드를 검사하고 발견된 위반 사항 중 자동 수정 가능한 부분을 즉시 수정한다.
   - 이 옵션을 사용하면 수동으로 코드를 수정하는 시간을 절약할 수 있다.
4. **편집기 확장을 통한 수정 적용**
   - 많은 텍스트 편집기와 IDE는 ESLint 확장 기능을 지원한다.
   - 이러한 확장 기능은 코드 편집 중에 실시간으로 ESLint 검사를 수행하고 문제를 강조 표시한다.
   - 또한 자동 수정 기능을 통해 편집기 내에서 바로 문제를 해결할 수 있는 옵션을 제공한다.
5. **수정 가능한 규칙 식별**
   - ESLint 공식 문서의 [규칙](https://eslint.org/docs/latest/rules/) 목록에서는 자동 수정을 지원하는 규칙을 특별한 아이콘(🔧)으로 표시한다.
   - 이를 통해 개발자는 어떤 규칙이 자동 수정 기능을 제공하는지 쉽게 파악할 수 있다.

### 규칙 제안 {#rule-suggestions}

ESLint의 규칙은 문제에 대한 자동 수정 외에도 개선을 위한 제안(Suggestions)을 제공할 수 있다. 

제안은 수정과는 몇 가지 차이점이 있으며, 더 폭넓은 코드 개선 방향을 제시한다.

1. **제안의 특징**
   - 제안은 코드의 동작을 변경할 수 있는 더 광범위한 개선 사항을 제안한다.
   - 제안은 단순한 문법 오류 수정이 아닌, 코드 구조나 로직의 변경을 포함할 수 있다.
   - 예를 들어, 성능 개선을 위해 반복문을 최적화하거나, 가독성을 높이기 위해 복잡한 조건문을 리팩토링하는 제안이 있을 수 있다.
2. **자동 적용 불가능**
   - 제안은 코드의 동작에 영향을 줄 수 있으므로 자동으로 적용할 수 없다.
   - 개발자는 제안을 검토하고 프로젝트의 요구 사항에 맞게 선택적으로 적용해야 한다.
   - 제안은 개발자의 판단과 맥락에 따라 채택 여부를 결정해야 하는 사항이다.
3. **ESLint CLI에서의 제한**
   - 제안은 ESLint 명령줄 인터페이스(CLI)를 통해 적용할 수 없다.
   - `--fix` 옵션을 사용해도 제안은 자동으로 적용되지 않는다.
   - 이는 제안이 코드 동작에 영향을 줄 수 있기 때문에, 개발자의 명시적인 승인이 필요하기 때문이다.
4. **편집기 통합을 통한 활용**
   - 제안은 주로 텍스트 편집기나 IDE의 ESLint 확장을 통해 활용된다.
   - 확장 기능은 제안을 시각적으로 강조 표시하고, 개발자가 쉽게 확인하고 적용할 수 있는 옵션을 제공한다.
   - 개발자는 편집기 내에서 제안을 검토하고, 필요한 경우 한 번의 클릭으로 제안을 적용할 수 있다.
5. **제안 가능한 규칙 식별**
   - ESLint 공식 문서의 [규칙](https://eslint.org/docs/latest/rules/) 목록에서는 제안을 제공하는 규칙을 전구 아이콘(💡)으로 표시한다.
   - 이를 통해 개발자는 어떤 규칙이 제안 기능을 지원하는지 쉽게 파악할 수 있다.

## 구성 파일(Configuration Files) {#configuration-files}

ESLint 구성 파일(Configuration Files)은 프로젝트 내에서 ESLint의 동작을 제어하는 설정을 정의하는 파일이다. 이 파일에는 ESLint에 내장된 규칙의 활성화 여부 및 적용 방식, 사용자가 직접 작성한 커스텀 규칙을 포함하는 플러그인, 다른 개발자 또는 팀에서 공유한 구성, 그리고 ESLint 규칙을 적용할 파일의 범위 등을 명시할 수 있다.

:::note
자세한 내용은 [문서](https://eslint.org/docs/latest/use/configure/configuration-files)를 참조한다.
:::

## 공유 가능한 구성(Shareable Configurations) {#shareable-configurations}

공유 가능한 구성(Shareable Configurations)은 ESLint 설정을 npm 패키지 형태로 배포하여 다른 사람들과 공유할 수 있게 해준다.

공유 가능한 구성은 주로 ESLint 내장 규칙을 활용하여 특정 코딩 스타일 가이드를 적용하는 데 사용된다. 대표적인 예로, [eslint-config-airbnb-base](https://www.npmjs.com/package/eslint-config-airbnb-base) 는 널리 알려진 Airbnb의 JavaScript 스타일 가이드를 ESLint 규칙으로 구현한 것이다.

:::note
자세한 내용은 [문서](https://eslint.org/docs/latest/use/configure/configuration-files#using-a-shareable-configuration-package)를 참조한다.
:::

## 플러그인(Plugins) {#plugins}

ESLint 플러그인(Plugins)은 ESLint의 기능을 확장하는 npm 패키지다. 플러그인은 추가적인 린팅 규칙, 설정, 프로세서, 그리고 실행 환경을 제공할 수 있으며, 주로 커스텀 규칙을 포함한다. 이를 통해 특정 코딩 스타일 가이드를 적용하거나, TypeScript와 같은 JavaScript 확장 문법, React와 같은 라이브러리, 또는 Angular와 같은 프레임워크에 특화된 규칙을 사용할 수 있다.

**플러그인은 흔히 특정 프레임워크의 모범 사례를 강제하기 위해 사용된다.** 

한 예로, [`@angular-eslint/eslint-plugin`](https://www.npmjs.com/package/@angular-eslint/eslint-plugin) 은 Angular 프레임워크를 사용할 때 권장되는 모범 사례를 ESLint 규칙으로 제공한다.

:::note
자세한 내용은 [문서](https://eslint.org/docs/latest/use/configure/plugins)를 참조한다.
:::

## 파서(Parsers) {#parsers}

ESLint 파서(Parsers)는 JavaScript 코드를 ESLint가 이해하고 분석할 수 있는 추상 구문 트리(Abstract Syntax Tree, AST)로 변환하는 역할을 한다. ESLint는 기본적으로 내장 파서인 [Espree](https://github.com/eslint/espree)를 사용하며, 이는 표준 JavaScript 문법 및 다양한 버전과 호환된다.

그러나 비표준 JavaScript 구문을 처리하기 위해서는 커스텀 파서를 사용해야 한다. 이러한 커스텀 파서는 대부분 공유 가능한 구성(Shareable Configurations)이나 플러그인에 포함되어 제공되므로, 개발자가 직접 사용할 필요는 없다.

예를 들어, [`@typescript-eslint/parser`](https://www.npmjs.com/package/@typescript-eslint/parser) 는 [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) 프로젝트에서 ESLint를 사용할 수 있도록 TypeScript 코드를 파싱할 수 있는 커스텀 파서다.


## 커스텀 프로세서(Custom Processors) {#custom-processors}

ESLint 프로세서(Custom Processors)는 JavaScript 이외의 파일 형식에서 JavaScript 코드를 추출하거나, ESLint가 코드를 파싱하기 전에 JavaScript 코드를 변형하는 역할을 한다. 

예를 들어, Markdown 파일 내부에 포함된 JavaScript 코드 블록을 린트하고 싶다면, [`eslint-plugin-markdown`](https://github.com/eslint/eslint-plugin-markdown) 플러그인에서 제공하는 커스텀 프로세서를 사용할 수 있다. 이 프로세서는 Markdown 파일에서 JavaScript 코드만 추출하여 ESLint가 해당 코드를 검사할 수 있도록 한다.

또 다른 활용 예시로는 ESLint 검사 전에 JavaScript 코드를 사전 처리하는 것이 있다. 프로세서를 통해 코드를 변환하거나 특정 패턴을 수정한 후 ESLint가 처리하도록 할 수 있다.

## 포맷터(Formatters) {#formatters}

ESLint 포맷터(Formatters)는 ESLint가 검사 결과를 출력하는 방식을 결정한다. 사용자는 포맷터를 통해 커맨드 라인 인터페이스(CLI)에서 보여지는 결과의 형태와 스타일을 원하는 대로 조정할 수 있다.

각 포맷터는 린트 결과를 다양한 형식으로 표현하여 개발자가 쉽게 이해하고 해석할 수 있도록 도와준다. 예를 들어, 결과를 표 형태로 출력하거나, JSON 형식으로 제공하는 등의 옵션을 선택할 수 있다.

:::note
자세한 내용은 [문서](https://eslint.org/docs/latest/use/formatters/)를 참조한다.
:::

## 통합(Integrations) {#integrations}

ESLint가 널리 사용되고 강력한 도구로 자리 잡은 이유 중 하나는 다양한 개발 환경과의 통합을 지원하는 풍부한 생태계 덕분이다. ESLint 자체의 기능도 훌륭하지만, 이를 개발자의 작업 환경에 자연스럽게 통합할 수 있다는 점이 큰 장점으로 작용한다.

대표적인 예로, 많은 코드 에디터와 통합 개발 환경(IDE)에서는 ESLint 확장 플러그인을 제공한다. 이러한 확장 플러그인은 개발자가 코드를 작성하는 동안 실시간으로 ESLint 검사를 수행하고 그 결과를 에디터 내에 직접 표시해준다. 따라서 개발자는 별도로 ESLint CLI를 실행하지 않고도 린팅 결과를 확인하고 문제를 해결할 수 있다. 

:::note
자세한 내용은 [문서](https://eslint.org/docs/latest/use/integrations)를 참조한다.
:::

## CLI 및 Node.js API {#cli-and-nodejs-api}

ESLint CLI(Command Line Interface)는 터미널 환경에서 ESLint 검사를 실행할 수 있는 도구다. CLI는 다양한 명령행 옵션을 제공하여 사용자가 원하는 대로 ESLint 동작을 제어할 수 있다. 예를 들어, 특정 디렉토리나 파일을 대상으로 검사를 수행하거나, 설정 파일의 위치를 지정하는 등의 작업을 수행할 수 있다.

한편, ESLint는 Node.js API도 제공한다. 이 API를 사용하면 Node.js 프로그램 내에서 ESLint 기능을 프로그래밍적으로 활용할 수 있다. 이는 주로 ESLint 플러그인, 에디터 통합, 혹은 ESLint 관련 도구를 개발할 때 유용하게 사용된다.

일반적인 경우라면 ESLint를 직접 확장하는 것이 아니라면 CLI를 사용하는 것이 권장된다. CLI는 대부분의 개발 환경에서 손쉽게 ESLint를 실행하고 결과를 확인할 수 있는 간편한 방법을 제공한다. 반면 Node.js API는 좀 더 세부적인 제어가 필요하거나 ESLint 기능을 다른 도구와 통합해야 하는 특수한 상황에서 사용하는 것이 좋다.


:::note
자세한 내용은 [Command Line Interface](https://eslint.org/docs/latest/use/command-line-interface)와 [Node.js API](https://eslint.org/docs/latest/integrate/nodejs-api)를 참조한다.
:::
