import * as S from './styles';

const ChatSendMessageForm = ({ onSubmit, onChange, value }) => {
  return (
    <S.Form onSubmit={onSubmit}>
      <S.MessageInput
        name="message"
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Type your message and hit ENTER"
        required
      />
    </S.Form>
  )
}

export default ChatSendMessageForm;
