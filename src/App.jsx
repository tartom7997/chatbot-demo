import React from 'react';
import dafaultDataset from "./dataset";
import './assets/styles/style.css';
import {AnswersList, Chats} from "./components/index";
import FormDialog from './components/Forms/FormDialog';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: [],
      chats: [],
      currentId: "init",
      dataset: dafaultDataset,
      open: false
    }
    this.selectAnswer = this.selectAnswer.bind(this)
    // Class compでの下記のような関数使用はbindが必要、それを直接return以降に渡せるようになる。毎回レンダーや関数の実行されず、負荷がかからない。
    this.handleClose = this.handleClose.bind(this)
    this.handleClickOpen = this.handleClickOpen.bind(this)
  }

  displayNextQuestion = (nextQuestionID) => {
    const chats = this.state.chats
    chats.push({
      text: this.state.dataset[nextQuestionID].question,
      type: 'question'
    })

    this.setState({
      answers: this.state.dataset[nextQuestionID].answers,
      chats: chats,
      currentID: nextQuestionID
    })

  }

  selectAnswer = (selectedAnswer, nextQuestionID) => {
    switch(true) {
      case (nextQuestionID === 'init'):
        setTimeout(() => this.displayNextQuestion(nextQuestionID), 500);
        break;

      case (nextQuestionID === 'contact'):
        this.handleClickOpen();
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
        const chats = this.state.chats;
        // 空の配列なのでchatの中身をPushする
        chats.push({
          text: selectedAnswer,
          type: 'answer'
        })

        this.setState({
            chats: chats
        })

        // 遅延表示
        setTimeout(() => this.displayNextQuestion(nextQuestionID), 1000);
        break;
    }
  }

  handleClickOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  componentDidMount() {
    const initAnswer ="";
    this.selectAnswer(initAnswer, this.state.currentId)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const scrollArea = document.getElementById('scrollArea')
    if (scrollArea) {
      // scorollHeigtがウィンドウ全体の高さで、それを現在の表示幅に合わせるので自動スクロールされる。
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  }

  render() {
    return (
      <section className="c-section">
        <div className="c-box">
          <Chats chats={this.state.chats} />
          <AnswersList answers={this.state.answers} select={this.selectAnswer} />
          <FormDialog open={this.state.open} handleClose={this.handleClose} />
        </div>
      </section>
    );
  }
}