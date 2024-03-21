# 佐伯久のAPI-Tutorial

```
nodenv install
npm i -g ts-node
```

1. Hello World
インストール
```
cd hello-world
yarn install
```

起動
```
yarn start
```

2. CRUD API
インストール
```
cd method
yarn install
```

DB起動
```
cd method
docker-compose up -d
```

起動
```
cd method
yarn migrate
yarn start
```

マイグレーションファイルを作成する場合
```
yarn make:migration
```

マイグレーションの実行
```
yarn migrate
```

ロールバック
```
yarn rollback
```