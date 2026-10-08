# Github-Pull-Request-Helper

<img width="1280" height="800" alt="image" src="https://github.com/user-attachments/assets/ad43b727-608d-4739-8646-4e8b5c9bbfc3" />

## 📖 Description

협업 시 Github Pull Request Description 내용을 변경사항(File Changed) 탭에서도 바로 확인해보세요!

그 외에도 부가적인 기능들이 지속해서 추가될 예정입니다.

## 🚨 Notice

### 1. If Github-Pull-Request-Helper not work

새로고침을 눌러 페이지를 리로드해주시길 바라겠습니다.

### 2. Caching a Pull Request Description
Pull Request Description 정보를 받아오기 위해 API 요청을 수행합니다. 
잦은 API 요청을 방지하기 위해 세션 스토리지(Session Storage)에 Description을 저장하며, 저장한 지 3분이 지난 경우에는 다시 요청을 보내 새로운 값을 저장합니다.

따라서, 3분 이내에 Pull Request Description이 갱신된 경우 다른 탭으로 전환하여 접속하여야 합니다.

또한, Tab이 닫히는 등 세션이 종료된 경우에는 Session Storage에 저장된 값이 자동으로 삭제됩니다.

## 🛠 Development

```
extension/   # 확장 프로그램 소스 (Chrome에 로드 / 웹스토어 업로드 대상)
assets/      # 로고 원본, 웹스토어 스크린샷 등 확장에 포함되지 않는 자료
scripts/     # 패키징 스크립트
```

- 로컬 테스트: `chrome://extensions` → 개발자 모드 → "압축해제된 확장 프로그램 로드" → `extension/` 선택
- 패키징: `./scripts/package.sh` 실행 시 `dist/github-pull-request-helper-v{version}.zip` 생성

## 📞 Contact
- Mail: hky035@gmail.com
- Github: https://github.com/hky035
- Blog: https://hky035.github.io
