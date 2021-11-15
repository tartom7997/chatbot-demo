import firebase from 'firebase/compat/app';
import "firebase/compat/firestore";
import firebaseConfig from "./config";

// あなたが使っているプロジェクトの設定値で初期化する。
firebase.initializeApp(firebaseConfig);
// DBという名前でエクスポートする。
export const db = firebase.firestore();