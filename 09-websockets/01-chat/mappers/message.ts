export default function mapMessage(message) {
  return {
    date: message.date,
    text: message.text,
    id: message.id,
    user: message.user,
  };
}
