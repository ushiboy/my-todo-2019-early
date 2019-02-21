# My Todo 2019 Early

## 概要

2019年2月時点での個人的なツールチェインの手元確認まとめ用、サンプルTodoアプリケーション開発環境。

[Demo](https://ushiboy.github.io/my-todo-2019-early/)


## 動作確認方法

### 初期化

```
$ npm install
```

### 開発

#### 開発サーバ起動

```
$ npm start
```

#### コードフォーマット、型チェック、Lint、テスト

```
$ npm run check
```

### ビルド

#### プロダクション用

```
$ npm run build
```

#### E2Eテスト用

```
$ npm run build-testing
```

#### ビルド動作確認サーバ起動

```
$ npm run serve
```

### E2Eテスト

#### 環境初期化

```
$ cd e2e
$ python3 -m venv venv
$ source venv/bin/activate
$ pip install -r requirements.txt
$ cd drivers
$ wget https://chromedriver.storage.googleapis.com/73.0.3683.20/chromedriver_linux64.zip
$ unzip chromedriver_linux64.zip
$ wget https://github.com/mozilla/geckodriver/releases/download/v0.24.0/geckodriver-v0.24.0-linux64.tar.gz
$ tar zxvf geckodriver-v0.24.0-linux64.tar.gz
```

#### テスト実行

E2Eテスト用にビルドして、動作確認サーバを起動しておく。

```
$ npm run build-testing
$ npm run serve
```

E2Eテスト環境でテスト実行する。

```
$ cd e2e
$ source venv/bin/activate
$ py.test todo
```

ヘッドレスブラウザでテストする場合`HEADLESS=1`環境変数を指定する。

```
$ HEADLESS=1 py.test todo
```

デフォルトではChromeを使うようになっているので、Firefoxで行う場合は`BROWSER=Firefox`環境変数を指定する。

```
$ BROWSER=Firefox py.test todo
```
