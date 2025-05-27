import { signOut } from "@/auth";

export default function LogoutPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLogout = async (_formData: FormData) => {
    'use server';
    await signOut();
  };

  return (
    <div>
      <h5>로그아웃 하시겠습니까?</h5>
      <form action={handleLogout}>
        <button type="submit">로그아웃</button>
      </form>
    </div>
  );
}