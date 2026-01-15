import { Input as BaseInput } from '@base-ui/react/input';

export default function Input(props: React.HTMLAttributes<HTMLInputElement>) {
  return (
    <BaseInput 
    {...props}
      placeholder="Name" 
      className="border border-solid border-neutral-400 box-border p-2 w-full h-8 rounded-sm bg-neutral-50 text-neutral-950 focus:outline-1 -outline-offset-1 text-sm" 
    />
  );
}
