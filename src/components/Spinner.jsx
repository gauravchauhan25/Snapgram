export default function Spinner({ loading }) {
  return (
    loading && (
      <div className="spinner">
        <img
          src="/icons/loader.svg"
          alt="Loading..."
        />
      </div>
    )
  );
}
