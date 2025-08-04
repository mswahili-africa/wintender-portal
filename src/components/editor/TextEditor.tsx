import { Control, useController } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type Props = {
  name: string;
  control: Control;
}
export function TextEditor({name,control}: Props) {

  const {field}=useController({name,control});

  return <ReactQuill theme="snow" value={field.value} placeholder='Type here' onChange={field.onChange} />;
}
