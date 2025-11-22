/// <reference types="vite/client" />

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.lottie' {
  const src: string;
  export default src;
}

declare module '*.lottie?url' {
  const src: string;
  export default src;
}
