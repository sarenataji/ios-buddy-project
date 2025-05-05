
const MomentsHeader = () => {
  return (
    <div className="flex flex-col items-center justify-center mb-12">
      <div className="uppercase tracking-widest text-sm mb-2 text-[#c69c6d] text-center" style={{ letterSpacing: "0.22em" }}>moments</div>
      <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#a67c50] mb-1 tracking-wide text-center drop-shadow-md">Time Capsule</h1>
      <div
        className="text-[#c69c6dbb] text-xs font-light text-center opacity-80 max-w-md mx-auto px-2"
        style={{
          fontWeight: 300,
          fontFamily: "Inter, system-ui, sans-serif",
          letterSpacing: "0.07em",
          lineHeight: 1.7,
          textTransform: "lowercase",
          fontStyle: "normal"
        }}
      >
        capturing the essence of time, one moment at a time
      </div>
    </div>
  );
};

export default MomentsHeader;
