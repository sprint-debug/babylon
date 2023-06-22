# 구조

- apis : 서버통신 모듈 및 api가 정의가 작성되는 폴더.
- clients : 클라이언트가 작성되는 폴더.
- common : 공통적으로 사용되는 기능이 개발되는 폴더.
    - stores : 공통으로 사용되는 글로벌 상태값이 정의되는 폴더. (with jotai)
    - styles : 공통으로 사용되는 스타일(scss) 요소가 모여있는 폴더.
    - hooks : 공통으로 사용되는 hook이 정의되는 폴더.
    - utils : 공통으로 사용되는 유틸리티 기능이 모여있는 폴더.
- components : 개발에 사용되는 컴포넌트들이 모여있는 폴더. (Molecules)
    - _core : 아토믹 디자인에 최소 단위에 컴포넌트 요소가 구현되는 폴더. ex) 버튼, 이미지 태그 등등 (Atoms)
- pages : 페이지별 기능이 구현되어있는 폴더. (Pages)
    - _shared : page에서 공통적으로 사용되는 컴포넌트가 구현되는 폴더. (Organisms)
- routers : 페이지별 라우팅 관련 정보가 정의되는 폴더.