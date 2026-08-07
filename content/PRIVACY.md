# GMOK 개인정보처리방침 / Privacy Policy

한국어 | [English](#gmok-privacy-policy-english)

시행일: 2026-07-31
최종 수정일: 2026-07-31

GMOK 운영팀(이하 "운영팀")은 GMOK 디스코드 봇과 웹 서비스(gmok.kr, 이하 통칭 "서비스")를
운영하며, 서비스 제공 과정에서 처리하는 개인정보를 아래와 같이 안내한다. 운영팀은
대한민국 개인정보 보호법 등 관련 법령과 Discord 개발자 약관·정책을 준수한다.

**문의·요청 창구**

- 이메일: gtrix0904@gmail.com
- GMOK 디스코드 지원 서버: https://discord.gg/R8SyV4ZFRC

디스코드 계정이 없는 사람도 이메일로 열람·정정·삭제·처리정지를 요청할 수 있다.

## 1. 수집하는 정보

### 1.1 디스코드 관련 정보

- 서버(길드) ID·서버 이름
- 사용자 ID, 사용자명·표시명, 서버 별명, 아바타 이미지 URL
- 웹 로그인(Discord OAuth2: `identify`, `guilds`, `guilds.members.read`) 시
  액세스·리프레시 토큰, 로그인 시점의 IP 주소·브라우저 정보(User-Agent)
- 오류 발생 시 해당 요청의 IP 주소·User-Agent·사용자 ID·요청 경로와 파라미터
  (오류 진단 목적)
- **메시지 본문은 저장하지 않는다.** 명령어 인식·첨부파일 감지를 위해 일시적으로
  읽을 뿐이다. 단, 오류 발생 시 해당 명령어의 입력 값이 오류 로그에 남을 수 있다.

### 1.2 게임(리그 오브 레전드) 관련 정보

- 업로드된 리플레이(.rofl)에서 추출한 **경기 참가자 전원**의 라이엇 ID(게임명·태그),
  PUUID, 경기 통계
- Riot Games API(Match-V5, Tournament-V5)로 조회한 경기 데이터
- 리플레이 파일 원본은 저장하지 않고 메모리에서만 파싱한다. 보관하는 것은 추출된
  경기 데이터, 파일명, 첨부파일 URL, 중복 검사용 해시값, 업로더의 서버 별명과
  업로드 시각이다.
- 토너먼트 코드 발급 시 디스코드 채널 ID와 발급자의 사용자 ID가 코드 메타데이터로
  Riot Games API에 전송된다.

전적 서비스 특성상, **라이엇 ID와 경기 통계는 gmok.kr에서 로그인 없이 누구나
조회할 수 있으며, 검색엔진에 색인될 수 있다.** 여기에는 GMOK을 이용한 적 없는 같은
경기 참가자의 정보도 포함된다(개인정보 보호법 제15조 제1항 제6호에 근거한 처리 —
게임 내에서 이미 참가자 간 공개된 정보에 한정되며 실명·연락처는 수집하지 않는다).
누구든 본인 전적의 비공개 처리(조회 미노출) 또는 삭제를 위 창구로 요청할 수 있고,
수집 출처·처리 목적·처리정지 요구권은 요청 시 개별 안내한다.

### 1.3 쿠키 및 브라우저 저장소

- 로그인 세션 쿠키 `session_uid` (HttpOnly·Secure, 최대 30일). 브라우저 설정에서
  거부할 수 있으나 차단 시 로그인 기능을 쓸 수 없다.
- localStorage의 최근 검색어·즐겨찾기는 브라우저에만 저장된다. 선택한 서버 ID 등
  일부 값은 API 요청에 포함될 수 있다.
- 광고·분석 트래킹 도구는 사용하지 않는다.

### 1.4 특권 게이트웨이 인텐트 (Privileged Intents)

- **Message Content** — `.rofl` 첨부파일 자동 감지와 `!` 접두사 명령어 인식에
  필요하다(첨부파일 정보는 이 인텐트 없이는 봇에 전달되지 않는다). 해당하지 않는
  메시지는 즉시 무시하며 본문을 저장하지 않는다.
- **Server Members** — 서버 별명(`라이엇게임명/태그` 형식)을 라이엇 계정과
  매핑하는 데 필요하다. 서버 관리자는 봇 명령으로 해당 서버의 멤버 목록(사용자명·
  표시명·가입일) CSV를 받을 수 있으며, 이 파일은 명령을 실행한 채널로 전송될 뿐
  운영팀 서버에 저장되지 않는다.

## 2. 수집 방법

- 사용자가 디스코드에서 봇 명령어를 사용하거나 리플레이 파일을 업로드할 때
- 사용자가 웹(gmok.kr)에서 리플레이 파일을 업로드할 때
- 사용자가 웹에서 Discord 계정으로 로그인할 때
- Riot Games API 조회를 통해

## 3. 이용 목적

- 내전(커스텀 게임) 전적 기록·통계·랭킹 등 서비스 핵심 기능 제공
- 디스코드 서버 별명과 라이엇 계정의 매핑(전적 조회 기능에 필요)
- 서비스 운영, 오류 진단 및 부정 이용 방지

## 4. 처리 위탁·제3자 제공·국외 이전

### 4.1 처리 위탁

| 수탁자 | 위탁 업무 | 보관 위치 |
|---|---|---|
| Amazon Web Services (AWS) | 데이터베이스·서버 호스팅 | 대한민국(서울 리전) |

### 4.2 제3자 제공

- 개인정보를 판매하거나 광고·마케팅 목적으로 제3자에게 제공하지 않는다.
- 법령에 근거한 수사기관 등의 적법한 요청이 있는 경우에만 예외적으로 제공할 수 있다.

### 4.3 국외 이전

서비스 제공을 위해 다음과 같이 개인정보가 국외로 이전된다.

| 이전받는 자 | 국가 | 이전 항목 | 목적 | 시기·방법 | 보유 기간 |
|---|---|---|---|---|---|
| Discord Inc. | 미국 | 디스코드 계정 ID, OAuth 토큰 | 계정 인증, 첨부파일 다운로드 | 서비스 이용 시 API 통신(HTTPS) | Discord 정책에 따름 |
| Riot Games, Inc. | 미국 | PUUID, 라이엇 ID, (토너먼트 이용 시) 디스코드 채널·사용자 ID | 경기 데이터 조회, 토너먼트 코드 발급 | 해당 기능 이용 시 API 통신(HTTPS) | Riot 정책에 따름 |

- 웹 이용 시 챔피언·아이템 이미지는 브라우저가 Riot의 공개 CDN(Data Dragon)에서
  직접 불러오며, 이 과정에서 이용자의 IP 주소가 해당 CDN에 전달된다.
- 국외 이전을 원하지 않는 경우 위 창구로 요청할 수 있다. 다만 이 경우 서비스의
  핵심 기능(로그인·전적 조회)을 이용할 수 없다.

## 5. 보관 기간 및 파기

| 항목 | 보관 기간 |
|---|---|
| 경기 기록·통계·라이엇 계정 매핑 | 수집일로부터 최대 3년 |
| 디스코드 계정 정보(ID·별명·아바타) | 수집일로부터 최대 3년 |
| 웹 로그인 세션(IP·User-Agent 포함) | 세션 만료 시(최대 30일) 삭제 |
| Discord OAuth 액세스·리프레시 토큰 | 로그아웃 또는 만료 시 폐기 |
| 오류 로그(IP·User-Agent 포함) | 수집일로부터 최대 3년 |

- 보관 기간이 만료된 정보는 자동 또는 수동으로 안전하게 삭제한다.
- 보유 목적이 달성된 정보와 서비스 종료 시의 보유 정보도 지체 없이 같은 방법으로
  파기한다.

## 6. 정보주체의 권리 (서비스 이용 여부와 무관)

본인 또는 정당한 대리인은 언제든지 위 창구를 통해 다음을 요청할 수 있다.
서비스를 이용한 적이 없더라도 리플레이에 참가자로 기록된 사람은 모두 아래 권리를
행사할 수 있다.

- 본인 정보의 열람·정정
- 본인 정보의 삭제
- 본인 정보의 처리 정지
- 수집 출처와 처리 목적의 고지

요청은 접수일로부터 10일 이내에 처리하고 결과를 통지한다. 정당한 사유로 기간 내
처리가 어려우면 그 사유와 예상 처리 시점을 미리 알린다.

- 요청은 본인 확인 후 처리한다.
- **삭제 처리 방식**: 경기 기록 전체를 삭제하면 같은 경기에 참여한 다른 참가자의
  기록까지 사라지므로, 원칙적으로 요청자의 라이엇 ID·PUUID를 복원할 수 없는 형태로
  익명 처리하는 방식으로 삭제한다. 경기 통계는 누구도 식별할 수 없는 익명 상태로만
  남는다. 기록 자체의 완전 삭제를 원하면 요청 시 그 취지를 함께 알려주기 바란다.
- **비공개 처리**: 삭제 대신 본인 전적이 조회에 노출되지 않도록 요청할 수도 있다.
  이 경우 데이터는 보관 기간 내 보존되며, 이후 언제든 삭제로 전환할 수 있다.

## 7. 안전성 확보 조치

- 모든 통신은 HTTPS/TLS로 암호화한다.
- 세션 쿠키는 HttpOnly·Secure 속성으로 발급한다.
- Discord OAuth 토큰은 접근이 제한된 데이터베이스에 보관하며, 서비스 기능 수행
  외의 목적으로 사용하지 않는다. 로그아웃 시 Discord에 토큰 폐기(revoke)를 요청한다.
- 개인정보에 접근할 수 있는 인원은 운영에 필요한 최소 인원으로 제한한다.
- 운영팀은 소규모 팀으로, 별도의 전담 보안 조직이나 물리적 전산 설비는 두지 않는다.
- 침해사고를 인지한 경우 관련 법령이 정한 기한 내에 이용자와 관계 기관에 통지한다.

## 8. 아동의 개인정보

본 서비스는 만 14세 미만 아동을 대상으로 하지 않으며, 만 14세 미만 아동의
개인정보를 알면서 수집하지 않는다. 만 14세 미만 아동의 정보가 수집된 사실이
확인되면 해당 정보를 지체 없이 삭제한다. 법정대리인은 위 창구로 삭제를 요청할 수
있다.

## 9. 권익침해 구제방법

개인정보 침해에 대한 신고·상담은 아래 기관에 문의할 수 있다.

- 개인정보분쟁조정위원회: 1833-6972 (www.kopico.go.kr)
- 개인정보침해신고센터: 118 (privacy.kisa.or.kr)
- 대검찰청: 1301 (www.spo.go.kr) / 경찰청: 182 (ecrm.police.go.kr)

## 10. 방침 변경

본 방침이 변경되는 경우 이 문서를 갱신하고 시행일을 명시한다. 중요한 변경은
지원 서버를 통해 공지한다.

## 11. 라이엇 게임즈 관련 고지

GMOK은 Riot Games의 승인·후원을 받지 않았으며, Riot Games 또는 리그 오브 레전드의
제작·관리에 공식적으로 관여하는 누군가의 견해나 의견을 대변하지 않는다. 리그 오브
레전드와 Riot Games는 Riot Games, Inc.의 상표 또는 등록상표이다.

---

# GMOK Privacy Policy (English)

[한국어](#gmok-개인정보처리방침--privacy-policy) | English

Effective date: July 31, 2026
Last updated: July 31, 2026

The GMOK team ("we") operates the GMOK Discord bot and the web service at gmok.kr
(collectively, the "Service"). This policy describes the personal data we process.
We comply with applicable privacy laws, including the Personal Information Protection
Act of the Republic of Korea, and with the Discord Developer Terms of Service and
Developer Policy.

**Contact / requests**

- Email: gtrix0904@gmail.com
- GMOK Discord support server: https://discord.gg/R8SyV4ZFRC

You do not need a Discord account to contact us; email requests are accepted from
anyone, including non-users whose data appears in an uploaded replay.

## 1. Data We Collect

### 1.1 Discord data

- Server (guild) IDs and server names
- User IDs, usernames/display names, server nicknames, and avatar image URLs
- On web sign-in (Discord OAuth2: `identify`, `guilds`, `guilds.members.read`):
  access/refresh tokens, plus the IP address and browser information (User-Agent)
  at sign-in
- When an error occurs: the IP address, User-Agent, user ID, and request path and
  parameters of the failing request (for diagnostics)
- **We do not store message content.** The bot reads messages transiently only to
  recognize commands and detect attachments. If an error occurs, the command's
  input values may be recorded in our error log.

### 1.2 Game (League of Legends) data

- From uploaded replay files (.rofl): the Riot ID (game name and tag line),
  PUUID, and match statistics of **all participants in that match**
- Match data retrieved from the Riot Games API (Match-V5, Tournament-V5)
- We do not store the original replay file; it is parsed in memory only. What we
  retain: the extracted match data, the file name, the attachment URL, a
  duplicate-detection hash, and the uploader's server nickname and upload time.
- When the tournament feature is used, the Discord channel ID and the issuing
  user's Discord ID are sent to the Riot Games API as tournament-code metadata.

As a match-history service, **Riot IDs and match statistics are published on
gmok.kr where anyone can view them without signing in, and may be indexed by
search engines.** This includes data about participants in the same match who
have never used GMOK (processed on the basis of legitimate interest under
Article 15(1)6 of the Korean Personal Information Protection Act — limited to
information already visible to the other participants in the game; we collect no
real names or contact details). Anyone may request that their records be hidden
from lookups or deleted through the contact channels above; upon request we will
inform you of the source of collection, the purpose of processing, and your
right to demand suspension of processing.

### 1.3 Cookies and browser storage

- Session cookie `session_uid` (HttpOnly and Secure, up to 30 days). You can
  refuse cookies in your browser settings; blocking it disables web sign-in.
- localStorage data such as recent searches and favorites stays in your browser.
  Some values, such as the selected server ID, may be included in API requests.
- We do not use advertising or analytics trackers.

### 1.4 Privileged Gateway Intents

- **Message Content** — required to auto-detect `.rofl` attachments and recognize
  `!` prefix commands (Discord does not deliver attachment data without this
  intent). Other messages are ignored immediately and message bodies are never
  stored.
- **Server Members** — required to map server nicknames (formatted as
  `RiotName/Tag`) to Riot accounts. Server administrators can export their own
  server's member list (username, display name, join date) as a CSV via a bot
  command; the file is sent to the channel where the command was run and is not
  retained on our servers.

## 2. How We Collect Data

- When you use bot commands or upload replay files on Discord
- When you upload replay files on the web (gmok.kr)
- When you sign in on the web with your Discord account
- Through requests to the Riot Games API

## 3. How We Use Data

- To provide core features: custom-game match history, statistics, and rankings
- To map Discord server nicknames to Riot accounts (required for match lookup)
- To operate the Service, diagnose errors, and prevent abuse

## 4. Processors, Sharing, and International Transfers

### 4.1 Processors

| Processor | Task | Data location |
|---|---|---|
| Amazon Web Services (AWS) | Database and server hosting | South Korea (Seoul region) |

### 4.2 Sharing with third parties

- We do not sell personal data or share it with third parties for advertising or
  marketing.
- We may disclose data only in response to lawful requests by authorities under
  applicable law.

### 4.3 International transfers

To provide the Service, personal data is transferred abroad as follows:

| Recipient | Country | Data | Purpose | When / how | Retention |
|---|---|---|---|---|---|
| Discord Inc. | USA | Discord account IDs, OAuth tokens | Account authentication, attachment downloads | API traffic over HTTPS during use | Per Discord's policies |
| Riot Games, Inc. | USA | PUUIDs, Riot IDs, and (for tournaments) Discord channel/user IDs | Match data retrieval, tournament code issuance | API traffic over HTTPS when the feature is used | Per Riot's policies |

- On the web, champion and item images are loaded by your browser directly from
  Riot's public CDN (Data Dragon), which receives your IP address in the process.
- You may object to these transfers through the contact channels above; in that
  case, the Service's core features (sign-in, match lookup) will be unavailable.

## 5. Retention and Deletion

| Data | Retention period |
|---|---|
| Match records, statistics, Riot account mappings | Up to 3 years from collection |
| Discord account info (ID, nickname, avatar) | Up to 3 years from collection |
| Web sign-in sessions (incl. IP, User-Agent) | Deleted at session expiry (up to 30 days) |
| Discord OAuth access/refresh tokens | Revoked at sign-out or expiry |
| Error logs (incl. IP, User-Agent) | Up to 3 years from collection |

- Data whose retention period has expired is safely deleted, automatically or
  manually.
- Data whose purpose has been fulfilled, and all retained data if the Service is
  discontinued, is destroyed promptly in the same manner.

## 6. Your Rights (whether or not you use the Service)

You, or your authorized representative, may at any time request the following
through the contact channels above. These rights extend to anyone who appears as
a participant in an uploaded replay, even if they have never used the Service.

- Access to or correction of your data
- Deletion of your data
- Suspension of processing of your data
- Notice of the source of collection and the purpose of processing

We process requests and notify you of the result within 10 days of receipt. If
processing within that period is not possible for a legitimate reason, we will
inform you of the reason and the expected timing in advance.

- Requests are processed after identity verification.
- **How deletion works**: Deleting an entire match record would also erase the
  records of the other participants in that match, so by default we delete by
  irreversibly anonymizing the requester's Riot ID and PUUID, leaving the match
  statistics in a form that identifies no one. If you want the records fully
  removed instead, please say so in your request.
- **Hiding instead of deletion**: You may instead ask that your records be
  hidden from lookups. In that case the data is kept within the retention
  period, and you can switch to deletion at any time.

## 7. Security

- All traffic is encrypted in transit using HTTPS/TLS.
- Session cookies are issued with the HttpOnly and Secure attributes.
- Discord OAuth tokens are stored in an access-restricted database and used
  solely to operate the Service. When you sign out, we ask Discord to revoke the
  token.
- Access to personal data is limited to the minimum number of operators required.
- We are a small team and do not maintain a dedicated security organization or
  physical computing facilities of our own.
- If we become aware of a data breach, we will notify affected users and the
  relevant authorities within the period required by applicable law.

## 8. Children's Privacy

The Service is not directed at children under 14, and we do not knowingly collect
personal data from children under 14. If we learn that such data has been
collected, we will delete it promptly. A parent or legal guardian may request
deletion through the contact channels above.

## 9. Remedies

For reports or counseling regarding privacy infringements (Republic of Korea):

- Personal Information Dispute Mediation Committee: 1833-6972 (www.kopico.go.kr)
- Privacy Infringement Report Center: 118 (privacy.kisa.or.kr)
- Supreme Prosecutors' Office: 1301 (www.spo.go.kr) / National Police Agency: 182
  (ecrm.police.go.kr)

## 10. Changes to This Policy

If this policy changes, we will update this document and its effective date.
Significant changes will be announced on the support server.

## 11. Riot Games Notice

GMOK isn't endorsed by Riot Games and doesn't reflect the views or opinions of
Riot Games or anyone officially involved in producing or managing Riot Games
properties. Riot Games, and all associated properties are trademarks or
registered trademarks of Riot Games, Inc. League of Legends is a trademark or
registered trademark of Riot Games, Inc.
