# gingerhotel-nest-server

### 설치

```jsx
npm i --legacy-peer-deps
```

### 실행

```jsx
npm run start:dev
```

### 확인

```jsx
// grapql playground 접속

http://localhost:3000/graphql 
```

![image](https://github.com/gingerhotel/gingerhotel-nest-server/assets/42020919/b6266b08-08fc-4e8a-b717-36cb03a52297)

```graphql
# graphql 쿼리

{
  findUser
}
```

## 간단한 nest 소개

[Nest.js의 기본과 시작](https://velog.io/@kisuk623/Nest.js의-기본과-시작)

## 파일 구조 소개
![image](https://github.com/gingerhotel/gingerhotel-nest-server/assets/42020919/9e686b7e-0893-4b1d-988c-156ee26bcc4d)


간단하게 구축해본 파일 구조를 작성하였습니다. 아직 디비를 어떤 거 사용할지 결정이 안되어서, 디비 연동은 아직 안 되어 있습니다. nest가 간단하게 어떻게 작동하는지 정도만 확인하시면 좋을 것 같습니다!

위에 적어둔 대로 resolver → controller → service 위주로 코드 확인하시면, 어떻게 작동하는지 이해가 잘 되실겁니다!

`http://localhost:3000/graphql` 링크 접속 시 나오는 화면은 이제 클라이언트에서 데이터를 요청할 때 미리 확인할 수 있는 페이지 정도로 이해해주시면 될 것 같습니다. 

### 참고

[TypeGraphQL · Modern framework for GraphQL API in Node.js](https://typegraphql.com/)

[Documentation | NestJS - A progressive Node.js framework](https://docs.nestjs.com/)

[GraphQL: API를 위한 쿼리 언어](https://graphql-kr.github.io/learn/)
