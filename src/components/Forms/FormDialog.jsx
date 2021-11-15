import React, {useState, useCallback, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextInput from './TextInput'
import {WEBHOOK_URL} from '../../webhookConfig'

const FormDialog = (props) => {
    // functional compからclassに元コード書き換え：const [open, setOpen] = React.useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDiscription] = useState("");

    const inputName = useCallback((event) => {
        setName(event.target.value)
    },[setName]);

    const inputEmail = useCallback((event) => {
        setEmail(event.target.value)
    },[setEmail]);

    const inputDescription = useCallback((event) => {
        setDiscription(event.target.value)
    },[setDiscription]);

    const validateEmailFormat = (email) => {
        const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        return regex.test(email)
    }

    const validateRequiredInput = (...args) => {
        let isBlank = false;
        for (let i = 0; i < args.length; i=(i+1)|0) {
            if (args[i] === "") {
                isBlank = true;
            }
        }
        return isBlank
    };

    const submitForm = () => {
        const isBlank = validateRequiredInput(name, email, description)
        const isValidEmail = validateEmailFormat(email)

        if (isBlank) {
            alert('必須入力欄が空白です。')
            return false
        } else if (!isValidEmail) {
            alert('メールアドレスの書式が異なります。')
            return false
       } else {
           const payload = {
               text: 'お問い合わせがありました\n' +
                     'お名前：' + name + '\n' +
                     'Email：' + email + '\n' +
                     'お問い合わせ内容：\n' + description
           };

           fetch(WEBHOOK_URL, {
               method: 'POST',
               body: JSON.stringify(payload)
           }).then(() => {
               alert('送信が完了しました。追ってご連絡します！')
               // 問い合わせ入力欄を初期化する。
               setName("")
               setEmail("")
               setDiscription("")
               return props.handleClose()
           })
       }
    };

    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
        >
            <DialogTitle id="alert-dialog-title">
                お問い合わせフォーム
            </DialogTitle>
            <DialogContent>
                <TextInput
                    label={"お名前（必須）"} multiline={false} row={1}
                    value={name} type={"text"} onChange={inputName}
                />
                <TextInput
                    label={"メールアドレス（必須）"} multiline={false} row={1}
                    value={email} type={"email"} onChange={inputEmail}
                />
                <TextInput
                    label={"お問い合わせ内容（必須）"} multiline={true} row={5}
                    value={description} type={"description"} onChange={inputDescription}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>
                    キャンセル
                </Button>
                <Button onClick={submitForm} autoFocus>
                    送信する
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormDialog