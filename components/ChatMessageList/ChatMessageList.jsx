import * as S from './styles';

const ChatMessageList = ({ messages }) => {
  return (
    <S.Wrapper>
      {!!messages && Object.keys(messages).map((key, index) => {
        const data = messages[key]
        return data.from !== "system" ? (
          <S.MessageBox key={`${data.text}-${index}`}>
            <S.PersonName>{data.name}</S.PersonName>
            <S.Message>{data.text}</S.Message>
          </S.MessageBox>
        ) : (
          <S.MessageBox key={`${data.text}-${index}`}>
            <S.Message>{data.text}</S.Message>
          </S.MessageBox>
        )
      })}
    </S.Wrapper>
  )
}

export default ChatMessageList;
