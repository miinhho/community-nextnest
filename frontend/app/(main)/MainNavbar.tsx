export const MainNavbar = () => {
  return (
    <nav className="flex flex-col gap-2">
      <a href="#" className="p-3 rounded-lg hover:bg-gray-100 text-gray-700">
        홈
      </a>
      <a href="#" className="p-3 rounded-lg hover:bg-gray-100 text-gray-700">
        알림
      </a>
      <a href="#" className="p-3 rounded-lg hover:bg-gray-100 text-gray-700">
        메시지
      </a>
      <a href="#" className="p-3 rounded-lg hover:bg-gray-100 text-gray-700">
        프로필
      </a>
    </nav>
  );
}