# Diary Doodle Studio

사진을 올리면 Gemini 이미지 모델을 이용해 고정된 다이어리 낙서 그림체로 자동 변환하는 개인용 웹앱입니다.

## Vercel 배포 및 Gemini API 설정

1. [Vercel](https://vercel.com/)에 로그인한 뒤 **Add New → Project**를 선택합니다.
2. GitHub의 `pwj7783-coder/Stickers` 저장소를 Import합니다.
3. 프로젝트 설정에서 **Environment Variables**에 아래 값을 추가합니다.
   - Name: `GEMINI_API_KEY`
   - Value: Google AI Studio에서 발급받은 Gemini API 키
4. **Deploy**를 누릅니다. 배포가 끝나면 Vercel이 제공하는 주소로 웹앱을 엽니다.
5. 사진 업로드 → 자동 변환 → PNG 저장 순서로 이용합니다.

API 키는 브라우저 코드에 넣지 않습니다. Vercel의 환경변수로만 저장하세요. 키를 설정한 뒤 재배포가 필요할 수 있습니다.

## 참고
- 이미지 변환을 위해 선택한 사진은 Gemini API로 전송됩니다.
- 결과물은 PNG로 다운로드할 수 있습니다. 투명 배경은 모델이 항상 보장하지 않으므로 결과에 따라 흰 배경이 포함될 수 있습니다.
- 이미지 생성 사용량 및 과금은 Google AI Studio/Gemini API 계정의 정책과 설정에 따릅니다.
- GitHub Pages는 정적 호스팅이므로 `/api/generate` 서버 함수를 실행하지 않습니다. API 생성 기능을 이용하려면 이 저장소를 Vercel에 배포한 앱 주소를 사용하세요.
