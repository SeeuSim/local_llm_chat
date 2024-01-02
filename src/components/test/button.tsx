'use client';

export const TestButton = () => {
  const handler = async () => {
    const _response = await fetch('/api/hello');
  };

  return (
    <button
      className='rounded-md bg-neutral-400 p-2 font-medium text-neutral-900'
      onClick={handler}
    >
      <span>Environment variable: `VAR_ONE`: {process.env.NEXT_PUBLIC_VAR_ONE}</span>
    </button>
  );
};
