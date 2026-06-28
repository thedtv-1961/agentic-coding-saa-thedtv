export default function CountdownBackground() {
  return (
    <>
      {/* Background image — organic colorful pattern */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-gray-900"
        style={{ backgroundImage: "url('/images/countdown-bg.jpg')" }}
        aria-hidden="true"
      />
      {/* Gradient overlay: dark left → transparent right — matches design */}
      <div className="fixed inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" aria-hidden="true" />
    </>
  );
}
