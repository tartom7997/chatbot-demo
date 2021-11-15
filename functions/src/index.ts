import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// adminを初期化する必要がある。
admin.initializeApp();
// 適宜認証を挟まないために、アドミン権限でFireStoreを操作するために宣言
const db = admin.firestore();

// ローカルのみで活用するため、エクスポートはつけない。
const sendResponse = (
    response: functions.Response, statusCode: number, body: any) => {
  response.send({
    statusCode,
    body: JSON.stringify(body),
  });
};

// functions.https.onRequestメソッドで関数を作成、外部から叩きたいのでエクスポート、
// コールバック関数でAsyncで非同期処理、Anyは型はなんでもOKという意味。アノテーション。
export const addDataset = functions.https.onRequest(
    async (req: any, res: any) => {
      if (req.method !== "POST") {
        sendResponse(res, 405, {error: "Invalid Request!"});
      } else {
        // APIにデータを投げる際にJSONデータをボディとして投げる。
        const dataset =req.body;
        // JSON形式のデータはオブジェクト型なので、オブジェクトのデータセットのキーだけを取り出し、
        // For文で回す、Keyのバリューを取り出す。
        for (const key of Object.keys(dataset)) {
          const data = dataset[key];
          // FirebaseではコレクションというDB名称になるが、questionsと命名しそちらにデータを入れていく。
          // コレクションはフォルダー、ドキュメントはファイル、データが文章というようなイメージ
          await db.collection("questions").doc(key).set(data);
        }
        sendResponse(res, 200, {message: "Successfully"});
      }
    });
