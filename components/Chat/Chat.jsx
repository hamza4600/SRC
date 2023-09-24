import { useState } from 'react'
import ChatMessageList from '../ChatMessageList/ChatMessageList';
import ChatTitle from '../ChatTitle/ChatTitle';
import ChatUsersList from '../ChatUsersList/ChatUsersList';
import ChatSendMessageForm from '../ChatSendMessageForm/ChatSendMessageForm';
import { useWS, wsStatus} from '../../providers/WSProvider'
import { chatStatus } from '../../constants/chatStatusOptions';
import * as S from './styles';

const Chat = ({ title }) => {
  const [value, setValue] = useState('')
  const [state, dispatch] = useWS()

  const onChange = (event) => {
    const newValue = event.currentTarget.value;
    setValue(newValue);
  }

  const onSubmit = (e) => {
    e.preventDefault()
    dispatch({
      type: 'send-message',
      text: value
    })
    setValue('')
  }

  if (state.chatStatus === chatStatus.open && state.status === wsStatus.connected) {
    return (
      <S.Wrapper>
        <ChatTitle title={title} dispatch={dispatch}/>
        <ChatMessageList messages={state.messages} />
        <ChatSendMessageForm onSubmit={onSubmit} onChange={onChange} value={value}/>
        {state.usersShown ? <ChatUsersList users={state.users}/>: null}
        
      </S.Wrapper>
    )
  }

  return null
}

export default Chat;
