export default async function AboutPage() {
   await new Promise((resolve) => setTimeout(resolve, 5000));

  return (
    <div>
      <h1>About Page</h1>
    </div>
  );
}
