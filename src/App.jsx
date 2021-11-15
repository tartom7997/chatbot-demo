import React, {useState, useEffect, useCallback} from 'react';
import './assets/styles/style.css';
import {AnswersList, Chats} from "./components/index";
import FormDialog from './components/Forms/FormDialog';
import {db} from './firebase/index'

const App = () => {
  const [answers, setAnswers] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentId, setCurrentId] = useState("init");
  const [dataset, setDataset] = useState({});
  const [open, setOpen] = useState(false);

  const  displayNextQuestion = (nextQuestionID, nextDataset) => {
    addChats({
      text: nextDataset.question,
      type: 'question'
    })

      setAnswers(nextDataset.answers)
      setCurrentId(nextQuestionID)

  }

  const  selectAnswer = (selectedAnswer, nextQuestionID) => {
    switch(true) {
      case (nextQuestionID === 'contact'):
        handleClickOpen();
        break;

      // 正規表現：文字列の先頭がhttpsで始まるものをtestメソッドで確認
      case (/^https:*/.test(nextQuestionID)):
        // Aタグを生み出す
        const a =document.createElement('a');
        a.href = nextQuestionID;
        // aタグのターゲットを別タブで開く
        a.target = '_blank';
        a.click();
        break;
      default:
        addChats({
          text: selectedAnswer,
          type: 'answer'
        })

        // 遅延表示
        setTimeout(() => displayNextQuestion(nextQuestionID, dataset[nextQuestionID]), 1000);
        break;
    }
  }

  const addChats = (chat) => {
    setChats(prevChats => {
      // 前回のチャットに対して、追加する。
      return [...prevChats, chat]
    })
  }

  const handleClickOpen = () => {
    setOpen(true)
  };

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen]);

  useEffect(() => {
    (async() => {
      const initDataset = {};
      // snapshotsを返り値にすべてのQuestionsを取得する。forEachでそれぞれを取り出す。
      // awaitをするとこで、Eachでデータがすべて入るまで待ってくれる
      await db.collection('questions').get().then(snapshots => {
        snapshots.forEach(doc => {
          // idはjob_offerなどの塊、データは中身
          const id =doc.id
          const data = doc.data()
          // IDをKey、Valueをdataにしてオブジェクトを入れている。
          initDataset[id] = data
        })
      })

      setDataset(initDataset)
      displayNextQuestion(currentId, initDataset[currentId])
    })()

  },[] )

  useEffect(() => {
    const scrollArea = document.getElementById('scrollArea')
    if (scrollArea) {
      // scorollHeigtがウィンドウ全体の高さで、それを現在の表示幅に合わせるので自動スクロールされる。
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  })

  return (
    <section className="c-section">
      <div className="c-box">
        <Chats chats={chats} />
        <AnswersList answers={answers} select={selectAnswer} />
        <FormDialog open={open} handleClose={handleClose} />
      </div>
    </section>
  );
}

export default App