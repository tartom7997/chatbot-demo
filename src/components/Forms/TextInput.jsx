import React from 'react';
import TextField from '@material-ui/core/TextField';

const TextInput = (props) => {
    return (
        <TextField
            // trueなら幅をフルに表現するTextFieldAPI
            fullWidth={true}
            label={props.label}
            margin={"dense"}
            // 複数行のときはTrueにしたい。
            multiline={props.multiline}
            row={props.rows}
            value={props.value}
            // text,emailなど
            type={props.type}
            onChange={props.onChange}
        />
    )
}

export default TextInput