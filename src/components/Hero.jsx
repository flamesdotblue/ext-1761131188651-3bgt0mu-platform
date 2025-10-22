import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/Nhk4dWoYLj83rV44/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-neutral-950/20 via-neutral-950/40 to-neutral-950" />

      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Chat with local AI. Beautiful, fast, private.
          </h1>
          <p className="mt-4 text-neutral-300 md:text-lg">
            A polished chat interface inspired by ChatGPT, wired to your local model server for private inference.
          </p>
        </div>
      </div>
    </section>
  );
}
