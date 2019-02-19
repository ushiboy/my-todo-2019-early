/* @flow */
import { toast } from 'react-toastify';

type Props = {
  message: ?string,
  messageType: ?string
};

export function Toast(props: Props) {
  const { message, messageType } = props;
  if (message && message.length > 0) {
    let type = toast.TYPE.INFO;
    if (messageType === 'success') {
      type = toast.TYPE.SUCCESS;
    } else if (messageType === 'danger') {
      type = toast.TYPE.ERROR;
    }
    toast(message, {
      type,
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: true
    });
  }
  return null;
}
