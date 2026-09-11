ServoCableFind v1 배포 방법

1. 이 폴더의 모든 파일을 GitHub 저장소 루트에 업로드합니다.
2. GitHub Repository > Settings > Pages
3. Build and deployment: Deploy from a branch
4. Branch: main / (root) 선택 후 Save
5. 잠시 후 https://사용자명.github.io/저장소명/ 주소로 무료 공개됩니다.

커스텀 도메인을 사용할 때:
- servocablefind.com 도메인을 구매합니다.
- GitHub Pages > Custom domain에 servocablefind.com 입력
- 도메인 판매처 DNS에 GitHub Pages용 레코드를 설정합니다.
- HTTPS를 활성화합니다.

AdSense:
- 사이트에 실제 정보성 콘텐츠를 충분히 보강한 뒤 신청
- 승인 후 제공되는 AdSense script를 index.html 및 필요한 페이지 <head>에 삽입
- ads.txt의 pub-XXXXXXXX 부분을 본인 Publisher ID로 교체
- 광고 배치가 과도하지 않도록 유지

중요:
- Cable Finder 로직은 Delta_Servo_Cable_Selector_v11_2.html 기준으로 통합됨
- 사이트는 Delta Electronics 공식 사이트가 아님
- 실제 적용 전 최신 공식 매뉴얼 확인 안내 유지 권장
